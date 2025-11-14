import { Response } from "express";

type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: TMeta;
  allCategories?: any;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    statusCode: data.statusCode,
    data: data.data,
    meta: data?.meta,
    allCategories: data?.allCategories,
  });
};

export default sendResponse;
