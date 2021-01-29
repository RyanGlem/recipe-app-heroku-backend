const Sequelize = require('sequelize')
const db = require ('../db')

const Recipe = db.sequelize.define('recipe', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},

	description: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	steps: {
		type: Sequelize.TEXT,
		allowNull: false
	},

	imageUrl: {
		type: Sequelize.STRING,
		isURL: true,
		defaultValue: '',
	},
});

module.exports = Recipe