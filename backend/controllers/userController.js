import User from "../models/userModel.js";
// import { errorHandler } from "../utils/errorHandler";
import catchAsyncErrors from "../middleware/catchAsync.js";
import { errorHandler } from "../utils/errorHandler.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto';


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

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} 
    \n\n If you have not requested this email then, please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: "BwraiMart Password Recovery",
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

        // Log the error and return an appropriate error response
        console.error(`Error sending password reset email: ${error.message}`);
        return next(errorHandler(500, "Internal Server Error"));
    }

})

// Reset Password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    // create token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    // Find user with the hashed reset password token and a valid expiration time
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },  // Ensure token has not expired
    });

    if (!user) {
        return next(errorHandler(400, "Reset Password token is not valid or has been expired"))
    }
    // Check if the new password and confirmed password match
    if (req.body.password !== req.body.confirmPassword) {
        return next(errorHandler(400, "Password does not match"));
    }

    // Update the user's password, reset token, and expiration; save changes to the database
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()
    // Send a new authentication token to the client
    sendToken(user, 200, res);
});

//Get user details
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

// Update User Password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(errorHandler(400, "Old Password does not match"));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(errorHandler(400, "Password does not match"));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
})

// Update User Profile
export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    })
})

// Get all users (admin)
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
});

// Get user details (admin)
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(errorHandler(501, `User does not exist with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

// Update User Role --Admin
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }
    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    })
})

// Delete User --Admin
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    // Cloudinary later
    if (!user) {
        return next(errorHandler(404, `User does not exist with the id: ${req.params.id}`))
    }
    await User.findByIdAndDelete(user);
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully!"
    })
})