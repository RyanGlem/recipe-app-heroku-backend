const Sequelize = require('sequelize')
const dotenv = require('dotenv')
dotenv.config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {

      ssl: {
        sslmode: 'require',
        rejectUnauthorized: false
      }
    }
  });

const testDB = async () => {

  try {
    await sequelize.authenticate()
    console.log ('Connection established')

  } catch (error) {
    
    console.error ('Unable to connect')
    
  }
}

testDB()

module.exports = { sequelize }