const Sequelize = require('sequelize');
const db = require('../db');
const crypto = require('crypto')

const User = db.sequelize.define('user', {
	firstName: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	lastName: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		validate: {
			isEmail: true
		}

	},

	username: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		
	},

	password: {
		type: Sequelize.STRING,
		get() {
		  return () => this.getDataValue("password");
		}
	  },
	  salt: {
		type: Sequelize.STRING,
		get() {
		  return () => this.getDataValue("salt");
		}
	  },
	imageUrl: {
		type: Sequelize.STRING,
		isURL: true,
		defaultValue: 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255626-stock-illustration-avatar-male-profile-gray-person.jpg',
    },
    
    skill: {
        type: Sequelize.STRING,
		allowNull: false,
		defaultValue: 'Amateur'
    }
});

User.generateSalt = function() {
	return crypto.randomBytes(16).toString("base64");
  };
  
  User.encryptPassword = function(plainText, salt) {
	return crypto
	  .createHash("RSA-SHA256")
	  .update(plainText)
	  .update(salt)
	  .digest("hex");
  };
  
  User.prototype.correctPassword = function(candidatePwd) {
	return User.encryptPassword(candidatePwd, this.salt()) === this.password();
  };
  
  const setSaltAndPassword = user => {
	if (user.changed("password")) {
	  user.salt = User.generateSalt();
	  user.password = User.encryptPassword(user.password(), user.salt());
	}
  };
  
  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);

module.exports = User;