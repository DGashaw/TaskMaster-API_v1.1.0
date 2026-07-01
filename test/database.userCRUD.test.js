/* eslint-env mocha */
const { addUser, updateUser, getUser, removeUser } = require('../database/userCRUD')
const { connectToDatabase, disconnectFromDatabase } = require('../config/databaseConnection')
const dotenv = require('dotenv')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

chai.use(chaiAsPromised.default || chaiAsPromised)
const { expect } = require('chai')

let env = null
let dbResponse = {}
let user = {}
let newUser = {}
describe('addUser function', () => {
  before(async () => {
    dotenv.config()
    env = process.env.NODE_ENV
    process.env.NODE_ENV = 'test'
    dbResponse = await connectToDatabase(process.env.NODE_ENV)
  })
  it('should add a new user successfully', async () => {
    user = {
      firstName: 'Daniel',
      lastName: 'Gashaw',
      email: 'nigussiedanieltoronto@gmail.com',
      password: 'Nina@1985'
    }
    await addUser(user.firstName, user.lastName, user.email, user.password)
    newUser = (await getUser())[0]
    expect(newUser).to.have.property('_id')
    expect(newUser.firstName).to.equal(user.firstName)
  })

  it('should throw an error for missing first name', async () => {
    user = {
      firstName: '',
      lastName: 'Molla',
      email: 'nina@hotmail.com',
      password: 'Nina@1985'
    }

    await expect(addUser(user.firstName, user.lastName, user.email, user.password)).to.be.rejected
  })
  it('should throw an error for missing last name', async () => {
    user = {
      firstName: 'Nina',
      lastName: '',
      email: 'nina@hotmail.com',
      password: 'Nina@1985'
    }

    await expect(addUser(user.firstName, user.lastName, user.email, user.password)).to.be.rejected
  })
  it('should throw an error for missing email address', async () => {
    user = {
      firstName: 'Nina',
      lastName: 'Molla',
      email: '',
      password: 'Nina@1985'
    }

    await expect(addUser(user.firstName, user.lastName, user.email, user.password)).to.be.rejected
  })
  it('should throw an error for missing password', async () => {
    user = {
      firstName: 'Nina',
      lastName: 'Molla',
      email: 'nina@hotmail.com',
      password: ''
    }

    await expect(addUser(user.firstName, user.lastName, user.email, user.password)).to.be.rejected
  })
  it('should throw an error for weak password', async () => {
    user = {
      firstName: 'Nina',
      lastName: 'Molla',
      email: 'nina@hotmail.com',
      password: '123456'
    }

    await expect(addUser(user.firstName, user.lastName, user.email, user.password)).to.be.rejected
  })
})
describe('getUser function', () => {
  it('should retrive all users successfully', async () => {
    const users = await getUser()
    expect(users).to.be.instanceOf(Array)
    expect(users).to.have.lengthOf(1)
    expect(users[0].email).to.equal(newUser.email)
  })
  it('should retrive a user by id sucessfully', async () => {
    const id = newUser._id
    const filter = { _id: id }
    const retriveUser = await getUser(filter)

    expect(retriveUser).to.be.instanceOf(Array)
    expect(retriveUser[0].email).to.equal(newUser.email)
  })
  it('should not return a user for invalid id', async () => {
    const filter = { _id: new mongoose.Types.ObjectId() }
    const retriveUser = await getUser(filter)
    expect(retriveUser).to.have.lengthOf(0)
  })
})
describe('updateUser function', () => {
  it('should update a user first name successfully', async () => {
    const updateObject = { firstName: 'Nigussie' }
    const updatedUser = await updateUser(newUser._id, updateObject)

    expect(updatedUser.firstName).to.be.equal(updateObject.firstName)
  })
  it('should update a user last name successfully', async () => {
    const updateObject = { lastName: 'Daniel' }
    const updatedUser = await updateUser(newUser._id, updateObject)

    expect(updatedUser.lastName).to.be.equal(updateObject.lastName)
  })
  it('should update a user email successfully', async () => {
    const updateObject = { email: 'daniel.gashaw@ryerson.ca' }
    const updatedUser = await updateUser(newUser._id, updateObject)

    expect(updatedUser.email).to.be.equal(updateObject.email)
  })
  it('should update a user password successfully', async () => {
    const updateObject = { password: 'Nina@123456' }
    const updatedUser = await updateUser(newUser._id, updateObject)

    const match = await bcrypt.compare(updateObject.password, updatedUser.password)
    expect(match).to.equal(true)
  })
})
describe('deleteUser function', () => {
  it('should delete the user successfully', async () => {
    await removeUser(newUser._id)
    const fetchUser = await getUser()

    expect(fetchUser).to.have.lengthOf(0)
  })

  after(async () => {
    await disconnectFromDatabase(process.env.NODE_ENV, dbResponse.mongoServer)
    process.env.NODE_ENV = env
  })
})
