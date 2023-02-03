import Joi from 'joi'

const userDto = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).trim().required(),

  password: Joi.string().alphanum().min(6).max(30).trim().required(),
})

export { userDto };