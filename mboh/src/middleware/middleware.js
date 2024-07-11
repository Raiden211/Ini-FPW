const jwt = require('jsonwebtoken');
const { getDb } = require("../config/config");
const JWT_KEY = 'TAWSINF';

async function cekApiKey (req,res,next) {
    const token = req.header('x-auth-token');

    if(!token)
    {
        return res.status(403).send({message: "Forbidden"});
    }

    try {
        const db = await getDb();
        let user = jwt.verify(token,JWT_KEY);

        let adauser = await db.collection('users').findOne({username: user.username});

        if (!adauser) {
            return res.status(404).send({ message: "User gak ada" });
        }
      
        req.user = adauser;
    } catch (error) {
        return res.status(400).send({message: error.message})
    }
    next();
}

// ini ak pakai cuman selain logres, ketembak mulu belum tau solusi e
async function cekUsernameAda (req,res,next) {
    const username = req.body.username;

    if(!username)
    {
        return res.status(400).send({message: "Username kosong"})
    }

    try {
        const db = await getDb();

        let adauser = await db.collection('users').findOne({username: username});

        // kalau login register dipisah, pakai ini
        // if (!adauser) {
        //     req.user = { username };
        // }
        // else 
        // {
        //     return res.status(400).send({ message: "Username sudah ada" });
        // }

        // kalau disatuin, mending dipisah middleware e :v
        // if (!adauser) {
        //     return res.status(400).send({ message: "Username sudah ada" });
        // }
    } catch (error) {
        return res.status(400).send({message: error.message})
    }

    next();
}

async function cekGuideAda (req,res,next) {
    const guide = req.params.id_guide;

    try 
    {
        const db = await getDb();
        let guideada = await db.collection("guides").findOne({ id_guide: guide });

        if(!guideada)
        {
            return res.status(404).send({message: "Guide nya ilang"})
        }

        req.guide = guideada
    } catch (error) {
        return res.status(400).send({message: error.message})
    }
    next()
}

module.exports = {cekApiKey,cekUsernameAda,cekGuideAda}