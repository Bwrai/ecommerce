export const errorHandler = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    // Capture stack Trace
    Error.captureStackTrace(error, errorHandler);
    return error;
}