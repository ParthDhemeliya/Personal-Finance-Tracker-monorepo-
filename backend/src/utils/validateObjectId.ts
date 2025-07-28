 import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const validateObjectId = (req: Request, res: Response, next: NextFunction): void => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Invalid ID format" });
    return;
  }
  next();
};

export default validateObjectId;
