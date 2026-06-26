/* eslint-env mocha */
const { connectToDatabase, disconnectFromDatabase } = require('../config/databaseConnection')
const { expect } = require('chai')
const dotenv = require('dotenv')

let env = null
let dbResponse = {}

describe('Test database connection in development enviroment', () => {
  before(async () => {
    dotenv.config()
    env = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    dbResponse = await connectToDatabase(process.env.NODE_ENV)
  })

  it('should connect to the development database successfully', async () => {
    expect(dbResponse.message).to.equal('connected to the database successfully')
  })

  after(async () => {
    await disconnectFromDatabase(process.env.NODE_ENV)
    process.env.NODE_ENV = env
  })
})

describe('Test the mongo memory database in test enviroment', () => {
  before(async () => {
    env = process.env.NODE_ENV
    process.env.NODE_ENV = 'test'
    dbResponse = await connectToDatabase(process.env.NODE_ENV)
  })

  it('should connect to the test database, mongo memory server, successfully', async () => {
    expect(dbResponse.message).to.equal('connected to the database successfully')
  })
  after(async () => {
    await disconnectFromDatabase(process.env.NODE_ENV, dbResponse.mongoServer)
    process.env.NODE_ENV = env
  })
})

describe('Test the mongo database connection for uknown enviroment', () => {
  before(async () => {
    env = process.env.NODE_ENV
    process.env.NODE_ENV = 'uknown'
    dbResponse = await connectToDatabase(process.env.NODE_ENV)
  })
  it('should not connect to the database for uknown enviromental value', async () => {
    expect(dbResponse.message).to.equal('unable to connect to the database')
    expect(dbResponse.status).to.equal('Uknown enviroment variable')
  })
  after(() => {
    process.env.NODE_ENV = env
  })
})

describe('Test database connection in production enviroment', () => {
  before(async () => {
    env = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    dbResponse = await connectToDatabase(process.env.NODE_ENV)
  })

  it('should connect to the production database successfully', async () => {
    expect(dbResponse.message).to.equal('connected to the database successfully')
  })
  after(async () => {
    await disconnectFromDatabase(process.env.NODE_ENV)
    process.env.NODE_ENV = env
  })
})
