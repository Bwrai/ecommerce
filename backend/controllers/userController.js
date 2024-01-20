import User from "../models/userModel.js";
// import { errorHandler } from "../utils/errorHandler";
import catchAsyncErrors from "../middleware/catchAsync.js";
import { errorHandler } from "../utils/errorHandler.js";
import { sendToken } from "../utils/jwtToken.js";


// Register new user
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "publicid",
            url: "url.."
        }
    })
    sendToken(user, 201, res);
})

// Login User

export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // check if user entered both email & password
    if (!email || !password) {
        return next(errorHandler(401, "Please Enter Email & Password"));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(errorHandler(401, "User not found!"));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(errorHandler(401, "Incorrect Email or Password!"));
    }
    sendToken(user, 200, res);
});