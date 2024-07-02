const { Model, DataTypes } = require("sequelize");
const sequelize = require("./config");

class Games extends Model{}
Games.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.INTEGER,
    },
},{
    sequelize,
    modelName: "Games",
    tableName: "games",
    timestamps: false
});

module.exports = Games;