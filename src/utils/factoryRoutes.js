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

  createOne = (Model) => {
    return async (req, res, next) => {
      const data = await Model.create(req.body)
      res.status(200).json({ status: 'success', data })
    }
  }

  updateOne = (Model) => {
    return async (req, res, next) => {
      const { id } = req.params
      const data = await Model.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json({ status: 'success', data })
    }
  }

  deleteOne = (Model) => {
    return async (req, res, next) => {
      const { id } = req.params
      const data = await Model.findByIdAndDelete(id)
      res.status(204).json({ status: 'success', data })
    }
  }
}

export default new FactoryRoutes()