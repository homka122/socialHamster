import { ApiError } from "../utils/ApiError.js";

export const validate = (dto) => async (req, res, next) => {
  try {
    const value = await dto.validateAsync(req.body, { abortEarly: false })
    req.body = value
  } catch (e) {
    return next(new ApiError(e.details.map(e => e.message).join('\n'), 400))
  }
  next();
}