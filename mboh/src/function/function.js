const { connectToDb, getDb } = require("../config/config");
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const JWT_KEY = 'TAWSINF';

// login register ini (tak satuin jadinya cek apabila name tidak ada maka dianggap login)
const logres = async(req,res) => {
    const {username,password,name} = req.body;
    //const username = req.user.username;

    if(!name)
    {
        try 
        {
            const db = await getDb();
            if(!password)
            {
                return res.status(400).send({message: "Field ada yg kosong entah napa"});
            }

            let cekuserada = await db.collection('users').findOne({ username: username });

            if(!cekuserada)
            {
                return res.status(404).send({message: "username g ada"});
            }

            if(password != cekuserada.password)
            {
                return res.status(404).send({message: "pw salah"});
            }
    
            let cariuser = await db.collection('users').findOne({ username: username });
    
            let token = jwt.sign({
                username: cariuser.username,
                status: cariuser.status
            },JWT_KEY, {expiresIn: '60m'});
    
            return res.status(200).send({token: token});
        } catch (error) {
            return res.status(400).send({message: error.message});
        }
    }
    else 
    {
        if(!password || !name)
        {
            return res.status(400).send({message: "Field ada yg kosong entah apa"});
        }

        try 
        {
            const db = await getDb();

            let cekuserada = await db.collection('users').findOne({ username: username });

            if(cekuserada)
            {
                return res.status(400).send({message: "username ada"});
            }

            let id = 1;
            let cekada = await db.collection('users').findOne({ _id: id });

            while(cekada)
            {
                id++;
                cekada = await db.collection('users').findOne({ _id: id });
            }

            await db.collection("users").insertOne({
                _id: id,
                username: username,
                password: password,
                name: name,
                saldo: 0,
                status: "Free"
            });

            let cariuser = await db.collection('users').findOne({ username: username });

            let token = jwt.sign({
                username: cariuser.username,
                status: cariuser.status
            },JWT_KEY, {expiresIn: '60m'});

            let data = ({
                username: cariuser.username,
                password: cariuser.password,
                name: cariuser.name,
                saldo: cariuser.saldo,
                status: cariuser.status,
                token: token
            });

            return res.status(201).send(data)
        } catch (error) {
            return res.status(400).send({message: error.message});
        }
    }
}

// ini buat isi saldo
const topupsaldo = async(req,res) => {
    const username = req.user.username;
    //const saldo_lama = req.user.saldo;
    const saldo_baru = req.body.saldo;

    // if (!saldo_baru || isNaN(saldo_baru)) {
    //     return res.status(400).send({ message: "Saldo harus angka" });
    // }

    //let saldoyglama = parseInt(saldo_lama);
    let saldoterbaru = parseInt(saldo_baru);

    if(saldoterbaru <= 0)
    {
        return res.status(400).send({ message: "Saldo gaboleh minus 0 atau 0" });
    }

    if(!/^\d+$/.test(saldo_baru))
    {
        return res.status(400).send({ message: "Saldo gaboleh mengandung huruf" });
    }

    try 
    {
        const db = await getDb();
        await db.collection("users").updateOne(
        {
            username: username
        }, {
            $set: {saldo: req.user.saldo + saldoterbaru}
        });

        let id = 1;
        let cekada = await db.collection('histories').findOne({ _id: id });

        while(cekada)
        {
            id++;
            cekada = await db.collection('histories').findOne({ _id: id });
        }

        await db.collection("histories").insertOne({
            _id: id,
            type: "Post",
            url: "/api/topup",
            biaya: 0,
            time: year(),
            username: username
        })

        let result = await db.collection("users").findOne({ username: username });

        return res.status(200).send({
            username: result.username,
            saldo: result.saldo
        })
    } catch (error)
    {
        return res.status(400).send({message: error.message});
    }
}

// upgrade jadi premium, biar bisa akses status premium hehe
const upgradeUser = async (req,res) => {
    const username = req.user.username;
    const saldo = req.user.saldo;

    let saldonya = parseInt(saldo);

    if(saldonya < 20000)
    {
        return res.status(400).send({message: "Kurang saldo e"});
    }
    
    try 
    {
        const db = await getDb();

        let cekstatus = await db.collection('users').findOne({ username: username });

        if(cekstatus.status == "Premium")
        {
            return res.status(400).send({message: "udah premium cuy :v"});
        }

        await db.collection("users").updateOne(
        {
            username: username
        }, {
            $set: {saldo: req.user.saldo - 20000, status: "Premium"}
        });

        let id = 1;
        let cekada = await db.collection('histories').findOne({ _id: id });

        while(cekada)
        {
            id++;
            cekada = await db.collection('histories').findOne({ _id: id });
        }

        await db.collection("histories").insertOne({
            _id: id,
            type: "Put",
            url: "/api/upgrade",
            biaya: 20000,
            time: year(),
            username: username
        })

        let result = await db.collection("users").findOne({ username: username });

        return res.status(200).send({
            username: result.username,
            saldo: result.saldo,
            status: result.status
        })
    } catch (error)
    {
        return res.status(400).send({message: error.message});
    }
}

// buat tambah2 guide
const addGuide = async(req,res) => {
    const {title,description,status} = req.body;
    const username = req.user.username;
    const saldouser = req.user.saldo;

    if(!title || !description || !status)
    {
        return res.status(400).send("Kosong")
    }

    let saldo = parseInt(saldouser);

    try {
        const db = await getDb();

        let found = await db.collection('users').findOne({ username: username });

        if(found.status == "Free")
        {
            if(status == "Premium")
            {
                return res.status(400).send("Kon iku free, kok mau premium :v")
            }
        }

        if(found.saldo < 3000)
        {
            return res.status(400).send("Kurang duitnya")
        }

        if(status != "Free" && status != "Premium")
        {
            return res.status(400).send("Status Invalid")
        }

        let id = 1;
        let cekada = await db.collection('guides').findOne({ _id: id });

        while(cekada)
        {
            id++;
            cekada = await db.collection('guides').findOne({ _id: id });
        }

        let idguide = 1;
        let paddingLength = idguide >= 10 ? 2 : 3;
        let guideid = "G" + idguide.toString().padStart(paddingLength, '0');
        let idada = await db.collection("guides").findOne({ id_guide: guideid });
        while(idada)
        {
            idguide++;
            paddingLength = idguide >= 10 ? 2 : 3;
            guideid = "G" + idguide.toString().padStart(paddingLength, '0');
            idada = await db.collection("guides").findOne({ id_guide: guideid });
        }

        await db.collection("guides").insertOne({
            _id: id,
            id_guide: guideid,
            title: title,
            description: description,
            status: status,
            username: username
        });

        await db.collection("users").updateOne(
        {
            username: username
        }, {
            $set: {saldo: saldo - 3000}
        });

        let idh = 1;
        let cek = await db.collection('histories').findOne({ _id: idh });

        while(cek)
        {
            idh++;
            cek = await db.collection('histories').findOne({ _id: idh });
        }

        await db.collection("histories").insertOne({
            _id: idh,
            type: "Post",
            url: "/api/guides",
            biaya: 3000,
            time: year(),
            username: username
        });

        let result = await db.collection("guides").findOne({ id_guide: guideid });

        let usernya = await db.collection("users").findOne({username: username});

        let data = {
            id_guide: result.id_guide,
            title: result.title,
            description: result.description,
            status: result.status,
            author: usernya.username,
            saldo: usernya.saldo
        }

        return res.status(201).send(data);
    } catch (error)
    {
        return res.status(400).send({message: error.message});
    }
};

const addSteps = async(req,res) => {
    const username = req.user.username;
    const idguide = req.guide.id_guide;
    const saldolama = req.user.saldo;
    const desc = req.body.description;

    let saldo = parseInt(saldolama);

    try 
    {
        const db = await getDb();

        // let found = await db.collection("users").findOne({username: username});

        // if(found.saldo < 500)
        // {
        //     return res.status(400).send("Kurang gan")
        // }

        if(saldo < 500)
        {
            return res.status(400).send("Kurang gan")
        }

        let guidenya = await db.collection("guides").findOne({ id_guide: idguide });

        if(guidenya.username == null)
        {
            return res.status(400).send("no username")
        }

        if(guidenya.username != username)
        {
            return res.status(400).send("Bukan punyamu sori :v")
        }

        let id = 1;
        let num = await db.collection("steps").findOne({ number: id });
        while(num)
        {
            id++;
            num = await db.collection("steps").findOne({ number: id });
        }   

        let ids = 1;
        let cekada = await db.collection('steps').findOne({ _id: ids });

        while(cekada)
        {
            ids++;
            cekada = await db.collection('steps').findOne({ _id: ids });
        }

        await db.collection("steps").insertOne({
            _id: ids,
            number: id,
            description: desc,
            guide_id: idguide
        });

        await db.collection("users").updateOne(
        {
            username: username
        }, {
            $set: {saldo: saldo - 500}
        });

        let idh = 1;
        let cek = await db.collection('histories').findOne({ _id: idh });

        while(cek)
        {
            idh++;
            cek = await db.collection('histories').findOne({ _id: idh });
        }

        await db.collection("histories").insertOne({
            _id: idh,
            type: "Post",
            url: "/api/guides/:id_guide/steps",
            biaya: 500,
            time: year(),
            username: username
        });

        let hasil = await db.collection("steps").findOne({
            guide_id: idguide, number: id
        });

        let data = {
            number: hasil.number,
            description: hasil.description
        }

        return res.status(201).send(data);
    } catch (error) {
        return res.status(400).send({message: error.message});
    }
};

const showGuides = async(req,res) => {
    const username = req.user.username;
    const idguide = req.guide.id_guide;
    const saldolama = req.user.saldo;
    let saldo = parseInt(saldolama);

    if(saldo < 1000)
    {
        return res.status(400).send("Kurang gan")
    }

    try 
    {
        const db = await getDb();
        let guidenya = await db.collection("guides").findOne({ id_guide: idguide });

        let usernya = await db.collection("guides").findOne({ username: username });

        if(guidenya.status == "Premium" && usernya.status == "Free")
        {
            return res.status(400).send("Bukan premium");
        }


        let guideWithSteps = await db.collection("guides").aggregate([
        {
            $match: { id_guide: idguide }
        },
        {
            $lookup: {
            from: "steps",
            localField: "id_guide",
            foreignField: "guide_id",
            as: "steps"
            }
        }
        ]).toArray();

        if (guideWithSteps.length > 0) {
        guideWithSteps = guideWithSteps.map(guide => {
            return {
            id_guide: guide.id_guide,
            title: guide.title,
            description: guide.description,
            status: guide.status,
            author: guide.username,
            steps: guide.steps.map(step => {
                return {
                number: step._id,
                description: step.description
                };
            })
            };
        });

        await db.collection("users").updateOne(
        {
            username: username
        }, {
            $set: {saldo: saldo - 1000}
        });

        let idh = 1;
        let cek = await db.collection('histories').findOne({ _id: idh });

        while(cek)
        {
            idh++;
            cek = await db.collection('histories').findOne({ _id: idh });
        }

        await db.collection("histories").insertOne({
            _id: idh,
            type: "Get",
            url: "/api/guides/:id_guide",
            biaya: 1000,
            time: year(),
            username: username
        });
        
            return res.status(200).send(guideWithSteps);
        }       
    } catch (error) {
        return res.status(400).send({message: error.message});
    }
};

const showHistory = async(req,res) => {
    try 
    {
        const db = await getDb();

        let histori = await db.collection('histories').find().toArray();

        let data = histori.map(item => ({
            type: item.type,
            url: item.url,
            biaya: item.biaya,
            time: item.time
        }));

        return res.status(200).send(data);
    } catch (error) {
        return res.status(400).send({message: error.message});
    }
};

module.exports = {logres,topupsaldo,upgradeUser,addGuide,addSteps,showGuides,showHistory};

function year() {
    let date = new Date()
    let stringDate = date.getDate().toString().padStart(2, "0")
    + "/" +
    (date.getMonth() + 1).toString().padStart(2, "0")
    + "/" +
    date.getFullYear()
    + " " +
    date.getHours().toString().padStart(2, "0")
    + ":" +
    date.getMinutes().toString().padStart(2, "0")
    + ":" +
    date.getSeconds().toString().padStart(2, "0")
    return stringDate;
}

// sekedar tips biar gampang jadi semisal diminta api_hit ya tinggal users.api_hit + 10/ api_hit: users.api_hit - 1
// catatan tambahan (g dipanggil mayoritas, dari project2 sebelumnya ttg cek umur, joi bcrypt, dsb)