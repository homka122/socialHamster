export const roleCheck = (...roles) => {
  const fn = (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error('Недостаточно прав'))
    }

    next()
  }

  return fn
}