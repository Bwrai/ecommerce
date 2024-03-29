import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsync.js";
import jwt from 'jsonwebtoken';

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return next(errorHandler(401, "Please Login to access this resource"))
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        next();
    } catch (error) {
        console.error("JWT Verification Error", error.message)
        return next(errorHandler(401, "Invalid Token"))
    }
})

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(errorHandler(403, `Role: ${req.user.role} is not allowed to access this resource`));
        }
        next();
    }
}
