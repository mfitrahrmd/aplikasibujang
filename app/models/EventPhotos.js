
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../../config/database');

const Event = require('./Event');

const EventPhotos = sequelize.define("eventPhotos", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    path: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = EventPhotos;