// src/modules/auth/auth.service.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthRepository } from './auth.repository.js';
import { AuthRequestBody, SignupRequestBody } from './auth.interface.js';
import { AppError } from '../../utils/error/AppError.js';

dotenv.config();

export const AuthService = {
  signup: async (data: SignupRequestBody) => {
    const existingUser = await AuthRepository.findByEmail(data.email);
    if (existingUser) throw new AppError('User already exists', 400);

    const user = await AuthRepository.createUser(data);
    return {
      token: AuthService.generateToken(user._id.toString()),
      // No need to return token to client
    };
  },

  login: async (data: AuthRequestBody) => {
    const user = await AuthRepository.findByEmail(data.email);
    if (!user) throw new AppError('Invalid credentials', 401);

    const isMatch = await user.matchPassword(data.password);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    return {
      id: user._id,
      email: user.email,
      token: AuthService.generateToken(user._id.toString()),
      // No need to return token to client
    };
  },

  getUser: async (id: string) => {
    const user = await AuthRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return user;
  },

  deleteUser: async (id: string) => {
    const deleted = await AuthRepository.deleteUser(id);
    if (!deleted) throw new AppError('User not found or already deleted', 404);
  },

  generateToken: (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });
  },
};
