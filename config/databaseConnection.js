const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const connectToDatabase = async (enviroment) => {
  if (enviroment === 'development') {
    try {
      const status = await mongoose.connect(process.env.MONGODB_DEVELOPMENT_CONNECTION_STR)
      return { status, message: 'connected to the database successfully' }
    } catch (error) {
      return { status: error.message, message: 'unable to connect to the database' }
    }
  } else if (enviroment === 'production') {
    try {
      const status = await mongoose.connect(process.env.MONGODB_PRODUCTION_CONNECTION_STR)
      return { status, message: 'connected to the database successfully' }
    } catch (error) {
      return { status: error, message: 'unable to connect to the database' }
    }
  } else if (enviroment === 'test') {
    try {
      const mongoServer = await MongoMemoryServer.create()
      const uri = await mongoServer.getUri()
      const status = await mongoose.connect(uri)

      return { status, message: 'connected to the database successfully', mongoServer }
    } catch (error) {
      return { status: error, message: 'unable to connect to the database' }
    }
  } else {
    return { status: 'Uknown enviroment variable', message: 'unable to connect to the database' }
  }
}

const disconnectFromDatabase = async (enviroment, databaseServer = null) => {
  if (enviroment === 'test') {
    try {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
      const status = databaseServer.stop()
      return { status, message: 'successfully disconnected from the database' }
    } catch (error) {
      return { status: error, message: 'unable to disconnect from the database' }
    }
  } else {
    try {
      const status = await mongoose.connection.close()
      return { status, message: 'successfully disconnected from the database' }
    } catch (error) {
      return { status: error, message: 'unable to disconnect from the database' }
    }
  }
}

module.exports = { connectToDatabase, disconnectFromDatabase }
