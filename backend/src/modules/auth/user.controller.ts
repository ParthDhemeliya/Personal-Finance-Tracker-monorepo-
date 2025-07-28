import { Request, Response, NextFunction } from 'express';
import User from '../../../models/User.js';

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id?.toString();
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const { first_name, last_name } = req.body;
    const updated = await User.findByIdAndUpdate(
      userId,
      { first_name, last_name, updated_at: new Date() },
      { new: true, runValidators: true },
    ).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// Avatar upload is a placeholder, as no avatar field exists in User model
// export const uploadAvatar = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   // You would handle file upload here and update the user document with avatar URL
//   res.status(501).json({ message: 'Avatar upload not implemented.' });
// };
