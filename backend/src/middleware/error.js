// Error handling middleware for Expenzo

// Custom error class
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async handler to avoid try-catch in controllers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error("💥 Error:", err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "🔍 Resource not found";
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = "🚫 Duplicate field value entered";

    // Extract field name from error
    const field = Object.keys(err.keyValue)[0];
    if (field === "email") {
      message = "📧 Email already exists. Please use a different email.";
    }

    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ErrorResponse(`❌ Validation Error: ${message}`, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "🔒 Invalid token. Please log in again.";
    error = new ErrorResponse(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "⏰ Your session has expired. Please log in again.";
    error = new ErrorResponse(message, 401);
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "💥 Something went wrong on our end!",
    ...(process.env.NODE_ENV === "development" && {
      error: err,
      stack: err.stack,
    }),
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new ErrorResponse(`🔍 Route ${req.originalUrl} not found`, 404);
  next(error);
};

module.exports = {
  ErrorResponse,
  asyncHandler,
  errorHandler,
  notFound,
};
