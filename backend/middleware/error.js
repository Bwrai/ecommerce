import { errorHandler } from "../utils/errorHandler.js";

const middlewareError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Mongodb cast error i.e - invalid url
    if (err.name === "CastError") {
        const message = `Resource not found: Invalid${err.path}`;
        err = errorHandler(400, message);
    }
    //Mongoose duplicate key error - user Creation
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = errorHandler(400, message)
    }
    //JWT token error
    if (err.name === "JsonWebTokenError") {
        const message = `Json web Token is invalid, please try again`;
        err = errorHandler(400, message);
    }
    // Token expired error
    if (err.name === "TokenExpiredError") {
        const message = `Json web Token expired, please try again`;
        err = errorHandler(400, message);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
export default middlewareError;