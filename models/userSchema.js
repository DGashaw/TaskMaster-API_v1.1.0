const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const { Schema, model } = mongoose

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required for new users'],
    min: [3, 'First name must have a length of atleast 3']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required for new users'],
    min: [3, 'Last name must have a length of atleast 3']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function () {
        return validator.isEmail(this.email)
      },
      message: props => `${props} is not a valid email address`
    }
  },
  password: {
    type: String,
    required: true,
    min: [8, 'Password must have a length of atleast 8'],
    validate: {
      validator: function (props) {
        return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}/.test(props)
      },
      message: 'The password must contain atleast one digit, one special chatacter, and one alphabet.'
    }
  }
},
{
  methods: {
    comparePassword: async function (password) {
      const result = await bcrypt.compare(password, this.password)
      return result
    }
  }
},
{
  timestamps: true
}
)

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(Number.parseInt(process.env.SALT_ROUND))
    user.password = await bcrypt.hash(user.password, salt)
  }
  // next()
})

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate()

  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(Number.parseInt(process.env.SALT_ROUND))
      update.password = await bcrypt.hash(update.password, salt)
      // next()
    } catch (error) {
      // next(error)
    }
  }
})

const User = model('User', userSchema)

module.exports = { User }
