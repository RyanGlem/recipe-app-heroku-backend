const Sequelize = require('sequelize')
const dotenv = require('dotenv')
dotenv.config()

const sequelize = new Sequelize('posterior-chain', 'postgres', process.env.DATABASE_PASS, {
    host: 'localhost',
    dialect: 'postgres'
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