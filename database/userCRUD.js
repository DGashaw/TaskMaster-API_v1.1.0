const { User } = require('../models/userSchema')
const addUser = async (firstName, lastName, email, password) => {
  const user = new User({
    firstName, lastName, email, password
  })
  await user.save()
}

const getUser = async (filter = {}) => {
  const response = await User.find(filter, { password: 0 })
  return response
}

const updateUser = async (userId, updateObject) => {
  const response = await User.findByIdAndUpdate(userId, updateObject, { returnDocument: 'after' })
  return response
}

const removeUser = async (userId) => {
  const response = await User.findByIdAndDelete(userId)
  return response
}

module.exports = {
  addUser,
  getUser,
  updateUser,
  removeUser
}
