class ErrorCustom extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ErrorCustom