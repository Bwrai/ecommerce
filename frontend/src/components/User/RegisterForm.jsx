import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FaceIcon from "@mui/icons-material/Face";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import defaultAvatar from "../../images/profile.png";
import { register } from "../../features/User/userSlice";
import { showAlert } from "../../features/alertSlice";
import { v4 as uuidv4 } from "uuid";

// ✅ Validation schema for registration form using Yup
const registerValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .matches(/^[a-zA-Z\s-]+$/, "Name can only contain letters, spaces, and hyphens")
        .required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    passwordConfirmation: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Password confirmation is required"),
});

const RegisterForm = ({ dispatch, isSubmitting, avatarPreviewUrl, setIsSubmitting, setAvatarPreviewUrl }) => {
    // ✅ Initialize form with React Hook Form
    const {
        register: registerSignup,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors },
        setValue,
        setError,
        reset,
    } = useForm({ resolver: yupResolver(registerValidationSchema) });

    // ✅ Handle avatar image upload
    const handleAvatarUpload = useCallback(
        (e) => {
            const selectedFile = e.target.files?.[0];

            // If no file selected, reset to default avatar
            if (!selectedFile) {
                setValue("avatar", null);
                setAvatarPreviewUrl(defaultAvatar);
                return;
            }

            // File size validation (max 2MB)
            if (selectedFile.size > 2 * 1024 * 1024) {
                setError("avatar", { type: "manual", message: "File must be less than 2MB" });
                setAvatarPreviewUrl(defaultAvatar);
                return;
            }

            // File type validation (only images allowed)
            if (!selectedFile.type.startsWith("image/")) {
                setError("avatar", { type: "manual", message: "Only images are allowed" });
                setAvatarPreviewUrl(defaultAvatar);
                return;
            }

            // Read the selected file and update preview
            const fileReader = new FileReader();
            fileReader.onload = () => {
                if (fileReader.readyState === fileReader.DONE) {
                    setAvatarPreviewUrl(fileReader.result);
                    setValue("avatar", selectedFile);
                }
            };
            fileReader.readAsDataURL(selectedFile);
        },
        [setValue, setError]
    );

    // ✅ Handle form submission
    const onRegisterSubmit = async (data) => {
        setIsSubmitting(true);

        // Create FormData to handle file uploads
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        if (data.avatar) {
            formData.append("avatar", data.avatar);
        }

        // Dispatch register action and reset form on success
        await dispatch(register(formData))
            .unwrap()
            .then(() => {
                reset();
                setAvatarPreviewUrl(defaultAvatar);
            })
            .finally(() => setIsSubmitting(false));
        dispatch(showAlert({
            id: uuidv4(),
            type: "success",
            message: "User Registration Successfull"
        }))
    };

    return (
        <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="authForm">
            {/* Name Input Field */}
            <div className="inputGroup">
                <FaceIcon />
                <input
                    {...registerSignup("name")}
                    type="text"
                    placeholder="Full Name"
                    className={registerErrors.name ? "errorField" : ""}
                />
                {registerErrors.name && <div className="errorMessage">{registerErrors.name.message}</div>}
            </div>

            {/* Email Input Field */}
            <div className="inputGroup">
                <MailOutlineIcon />
                <input
                    {...registerSignup("email")}
                    type="email"
                    placeholder="Email Address"
                    className={registerErrors.email ? "errorField" : ""}
                />
                {registerErrors.email && <div className="errorMessage">{registerErrors.email.message}</div>}
            </div>

            {/* Password Input Field */}
            <div className="inputGroup">
                <LockOpenIcon />
                <input
                    {...registerSignup("password")}
                    type="password"
                    placeholder="Password"
                    className={registerErrors.password ? "errorField" : ""}
                />
                {registerErrors.password && <div className="errorMessage">{registerErrors.password.message}</div>}
            </div>

            {/* Password Confirmation Field */}
            <div className="inputGroup">
                <LockOpenIcon />
                <input
                    {...registerSignup("passwordConfirmation")}
                    type="password"
                    placeholder="Confirm Password"
                    className={registerErrors.passwordConfirmation ? "errorField" : ""}
                />
                {registerErrors.passwordConfirmation && (
                    <div className="errorMessage">{registerErrors.passwordConfirmation.message}</div>
                )}
            </div>

            {/* Avatar Upload Field */}
            <div className="inputGroup avatarUploader">
                <img src={avatarPreviewUrl} alt="Profile avatar preview" />
                <input accept="image/*" onChange={handleAvatarUpload} type="file" />
                {registerErrors.avatar && <div className="errorMessage">{registerErrors.avatar.message}</div>}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
            </button>
        </form>
    );
};

export default RegisterForm;
