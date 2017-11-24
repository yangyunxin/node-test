'use strict'
/**
 * 定义Topic模型
 */
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('User', {
		id: { 
			type: DataTypes.STRING, 
			primaryKey: true 
		},
		title: DataTypes.STRING,
		url: DataTypes.STRING,
	}, {
		timestamps: true,
		underscored: true,
		freezeTableName: true,
		tableName: 'user',
		charset: 'utf8',
		collate: 'utf8_general_ci'
	})
}





