const Sequelize = require("sequelize");

const db = new Sequelize(
    "gamestore", 
    "root", 
    "", 
    {
        host: "localhost", 
        port: 3306, 
        dialect: "mysql",
        logging: true,
        timezone: "+07:00"
    }
);

module.exports = db;