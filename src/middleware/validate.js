import validator from "validator"
import { ApiError } from "../utils/ApiError.js"

class Validate {
  isStringAndNotUndefined = (value) => {
    return (typeof value === 'string' && value)
  }

  inputUser = (req, res, next) => {
    let errors = []
    const inputUsername = req.body.username
    const inputPassword = req.body.password

    if (!this.isStringAndNotUndefined(inputUsername) || !this.isStringAndNotUndefined(inputPassword)) {
      return next(new ApiError('Поля username и password должны быть строками и не быть пустыми', 400))
    }

    const username = inputUsername.trim();
    const password = inputPassword.trim();

    if (!validator.isLength(username, { min: 3, max: 30 })) {
      errors.push('Имя пользователя должно быть больше 3 символов и меньше 30')
    }

    if (!validator.isAlphanumeric(username)) {
      errors.push('Имя пользователя должно состоять только из латинских букв и цифр')
    }

    if (!validator.isLength(password, { min: 6, max: 30 })) {
      errors.push('Длина пароля должна быть больше 6 и меньше 30 символов')
    }

    if (!validator.isAlphanumeric(password)) {
      errors.push('Пароль должен состоять только из латинских букв и цифр')
    }

    if (errors.length > 0) {
      return next(new ApiError(errors.join('\n'), 400))
    }

    req.body = { username, password }
    next()
  }
}

export const validate = new Validate();