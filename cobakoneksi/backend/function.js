const { where } = require('sequelize');
const Games = require('./game');

const cobaAdd = async(req,res) => {
    const {title, image, price} = req.query;

    const namaAda = await Games.findOne({where: {title: title}});

    if(namaAda)
    {
        return res.status(400).send("Sudah ada bang");
    }

    const harga = parseInt(price);

    let id = 1;
    let idada = await Games.findByPk(id);
    while(idada)
    {
        id++;
        idada = await Games.findByPk(id);
    }

    await Games.create({
        id: id,
        title: title,
        image: image,
        price: harga
    })

    return res.status(201).send("Berhasil");
};

const cobaEdit = async(req,res) => {
    const id = req.query.id;
    const {title, image, price} = req.query;

    let caridata = await Games.findByPk(id);

    if(!caridata)
    {
        return res.status(400).send("No data");
    }

    await Games.update({
        title: title,
        image: image,
        price: harga
    }, {where: {
        id: id
    }});

    return res.status(200).send({msg: "Data updated"})
};

const cobaDelete = async(req,res) => {
    const id = req.query.id;
    let caridata = await Games.findByPk(id);

    if(!caridata)
    {
        return res.status(400).send("No data");
    }

    await Games.destroy({where: {id: id}});
    return res.status(200).send("Game dihapus");
};

const getAllGames = async(req,res) => {
    let data = await Games.findAll();
    return res.status(200).send({msg: "Data fetched", data});
};

const getOneGames = async(req,res) => {
    const id = req.params.id;
    let caridata = await Games.findByPk(id);

    if(!caridata)
    {
        return res.status(400).send("No data");
    }

    return res.status(200).send({msg: "A data has been fetched", data: caridata})
}

module.exports = {cobaAdd, cobaEdit, cobaDelete, getAllGames, getOneGames};
