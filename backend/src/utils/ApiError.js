class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errorCode,
    errors = [],
    isOperational = true
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;