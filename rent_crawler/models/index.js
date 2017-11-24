'use strict'

const Sequelize = require('sequelize')
const sequelize = new Sequelize('room', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		acquire: 3000,
		idle: 10000
	},
	operatorsAliases: false
})

/**
 * 数据库链接检测
 */
sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});



const User = sequelize.define('user', {
	id: { 
		type: Sequelize.STRING, 
		primaryKey: true 
	},
	title: Sequelize.STRING,
	url: Sequelize.STRING,
})

module.exports = User