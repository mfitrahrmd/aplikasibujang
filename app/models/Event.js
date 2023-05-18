
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../../config/database');

const EventPhotos = require('./EventPhotos');

const Event = sequelize.define("event", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false
	},
	date: {
		type: DataTypes.DATE,
		allowNull: false
	}
});

module.exports = Event;