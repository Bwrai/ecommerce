import User from "../models/userModel.js";
// import { errorHandler } from "../utils/errorHandler";
import catchAsyncErrors from "../middleware/catchAsync.js";
import { errorHandler } from "../utils/errorHandler.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";


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

// Logout User
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully!"
    })
})

// Forgot Password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(errorHandler(404, "User not found"));
    }
    //Get resetPassword token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} 
    \n\n If you have not requested this email then, please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: "BVerse Password Recovery",
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(errorHandler(500, error.message))
    }

})