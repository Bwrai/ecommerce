import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FaceIcon from "@mui/icons-material/Face";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import defaultAvatar from "../../images/profile.png";
import { updateProfile } from "../../features/User/userSlice";
import { showAlert } from "../../features/alertSlice";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import './UpdateProfile.css'

// ✅ Validation schema for updating profile
const updateProfileSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .matches(/^[a-zA-Z\s-]+$/, "Name can only contain letters, spaces, and hyphens")
        .required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
});

const UpdateProfile = () => {

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(defaultAvatar)

    const {
        register: updateField,
        handleSubmit: handleUpdateSubmit,
        setValue,
        setError,
        reset,
        formState: { errors },
    } = useForm({ resolver: yupResolver(updateProfileSchema) });

    // ✅ Load current user data into form
    useEffect(() => {
        if (user) {
            setValue("name", user.name || "");
            setValue("email", user.email || "");
            setAvatarPreviewUrl(user.avatar?.url || defaultAvatar);
        }
    }, [user, setValue]);

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

    // ✅ Submit updated profile
    const onSubmit = async (data) => {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        if (data.avatar) {
            formData.append("avatar", data.avatar);
        }

        await dispatch(updateProfile(formData))
            .unwrap()
            .then(() => {
                reset();
                setAvatarPreviewUrl(defaultAvatar);
                dispatch(showAlert({
                    id: uuidv4(),
                    type: "success",
                    message: "Profile updated successfully",
                }));
            })
            .catch((error) => {
                console.error("Update profile error:", error);
                dispatch(showAlert({
                    id: uuidv4(),
                    type: "error",
                    message: error.message || "Failed to update profile",
                }));
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <form onSubmit={handleUpdateSubmit(onSubmit)} className="authForm">
            {/* Name */}
            <div className="inputGroup">
                <FaceIcon />
                <input
                    {...updateField("name")}
                    type="text"
                    placeholder="Full Name"
                    className={errors.name ? "errorField" : ""}
                />
                {errors.name && <div className="errorMessage">{errors.name.message}</div>}
            </div>

            {/* Email */}
            <div className="inputGroup">
                <MailOutlineIcon />
                <input
                    {...updateField("email")}
                    type="email"
                    placeholder="Email Address"
                    className={errors.email ? "errorField" : ""}
                />
                {errors.email && <div className="errorMessage">{errors.email.message}</div>}
            </div>

            {/* Avatar */}
            <div className="inputGroup avatarUploader">
                <img src={avatarPreviewUrl} alt="Avatar Preview" />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                />
                {errors.avatar && <div className="errorMessage">{errors.avatar.message}</div>}
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
        </form>
    );
};

export default UpdateProfile;
