import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { IUserDocument } from '../../../models/User.js';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AuthService.signup(req.body);
    res.status(201).json({
      token: result.token,
      message: 'Signup successful',
    });
  } catch (err: unknown) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AuthService.login(req.body);
    // Set JWT as HttpOnly cookie
    // const isProduction = process.env.NODE_ENV === 'production';

    // res.cookie('token', result.token, {
    //   httpOnly: true,
    //   secure: isProduction, //  true on Render (prod), false on localhost
    //   sameSite: isProduction ? 'none' : 'lax', // 'none' enables cross-origin cookies in prod
    //   path: '/',
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });
    // Do not send token in JSON response
    res.status(200).json({
      id: result.id,
      email: result.email,
      token: result.token,
      message: 'Login successful',
    });
  } catch (err: unknown) {
    next(err);
  }
};

// Add a logout endpoint to clear the cookie
export const logout = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = (req.user as IUserDocument)._id.toString();
    const user = await AuthService.getUser(userId);
    console.log('userr', user);
    res.status(200).json(user);
  } catch (err: unknown) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = (req.user as IUserDocument)._id.toString();
    await AuthService.deleteUser(userId);
    res.status(204).send();
  } catch (err: unknown) {
    next(err);
  }
};
