import { ApiError } from "../utils/ApiError.js"

export const errorMiddleware = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ status: 'error', message: error.message })
  }

  console.log(error)
  return res.status(500).json({ status: 'error', message: 'Непридвиденная ошибка' })
}