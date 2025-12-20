import ApiError from "../utils/ApiError.js";

// Handle MongoDB duplicate key errors
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new ApiError(400, message);
};

// Handle MongoDB validation errors
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(400, message);
};

// Handle MongoDB cast errors (invalid ObjectId)
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(400, message);
};

// Handle JWT errors
const handleJWTError = () => new ApiError(401, 'Invalid token. Please log in again!');

const handleJWTExpiredError = () => new ApiError(401 , 'Your token has expired! Please log in again.');

// Development error handler
const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode || 500).json({
      status: err.status,
      statusCode : err.statusCode,
      message: err.message,
      stack: err.stack
    });
  }
  
  // Rendered website
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

// Production error handler
const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or other unknown error: don't leak error details
    console.error('ERROR', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }

  // Rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // Programming or other unknown error: don't leak error details
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "File too large. Max size 15MB",
    });
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateKeyError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};


// Async error wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export {
  globalErrorHandler,
  catchAsync,
  notFound
};
