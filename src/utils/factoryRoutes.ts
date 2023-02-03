import { NextFunction, Request, Response } from 'express';

class FactoryRoutes {
  getAll = (Model: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const data = await Model.find();
      res.status(200).json({ status: 'success', data });
    };
  };

  getOne = (Model: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const data = await Model.findById(id);
      res.status(200).json({ status: 'success', data });
    };
  };

  createOne = (Model: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const data = await Model.create(req.body);
      res.status(200).json({ status: 'success', data });
    };
  };

  updateOne = (Model: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const data = await Model.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({ status: 'success', data });
    };
  };

  deleteOne = (Model: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const data = await Model.findByIdAndDelete(id);
      res.status(204).json({ status: 'success', data });
    };
  };
}

export default new FactoryRoutes();
