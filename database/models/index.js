// Here, we can prepare to register our models,
//set up associations between tables,
const db = require('../db')
const User = require('./users');
const Recipe = require('./recipes')

User.recipes = User.hasMany(Recipe)
Recipe.user = Recipe.belongsTo(User)




module.exports = {
	User,
	Recipe
};
