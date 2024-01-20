import { errorHandler } from "../utils/errorHandler.js";

const middlewareError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Mongodb cast error i.e - invalid url
    if (err.name === "CastError") {
        const message = `Resource not found: Invalid${err.path}`;
        err = errorHandler(400, message);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
export default middlewareError;