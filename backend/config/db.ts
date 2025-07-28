/* eslint-env node */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI as string);
    console.log(chalk.green.bold('✅ MongoDB connected successfully'));
  } catch (error) {
    console.error(chalk.red.bold('❌ MongoDB connection failed:'), error);
    process.exit(1);
  }
};

export default run;
