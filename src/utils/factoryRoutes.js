class FactoryRoutes {
  getAll = (Model) => {
    return async (req, res, next) => {
      const data = await Model.find()
      res.status(200).json({ status: 'success', data })
    }
  }

  getOne = (Model) => {
    return async (req, res, next) => {
      const { id } = req.params
      const data = await Model.findById(id)
      res.status(200).json({ status: 'success', data })
    }
  }
}

export default new FactoryRoutes()