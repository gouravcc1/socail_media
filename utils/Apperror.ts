// IAppError.ts
interface IAppError {
  statusCode: number;
  status: string;
  isOperational: boolean;
}

class AppError extends Error implements IAppError {
  statusCode: number; // Define the property 'statusCode'
  status: string; // Define the property 'status'
  isOperational: boolean; // Define the property 'isOperational'
  code?: number; //optional
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.code = this.code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
