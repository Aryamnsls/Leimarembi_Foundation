import { Response } from 'express';

export const sendSuccess = (res: Response, message: string, data?: any, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, message: string, statusCode: number = 400, errors?: any) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
