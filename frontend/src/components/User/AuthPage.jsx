import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import defaultAvatar from "../../images/profile.png"

import "./AuthPage.css"
import { showAlert } from '../../features/alertSlice';
import { v4 as uuidv4 } from 'uuid';
import { clearErrors } from '../../features/User/userSlice';
import Loader from '../layout/Loader/Loader';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { login, register } from '../../features/User/userSlice';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FaceIcon from '@mui/icons-material/Face';
import { Link } from 'react-router-dom';

// Authentication hook and loading state
const useAuthentication = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const prevErrorRef = useRef(null);

    const { error, isAuthenticated, loading } = useSelector((state) => state.user);
    const redirectPath = location.search ? location.search.split("=")[1] : "/";

    // Navigate when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirectPath);
        }
    }, [navigate, redirectPath, isAuthenticated])
    // Handle Errors
    useEffect(() => {
        if (error && error !== prevErrorRef.current) {
            prevErrorRef.current = error;
            dispatch(showAlert({ id: uuidv4(), type: "error", message: error }));
            dispatch(clearErrors());
        }
    }, [error, dispatch])
    return { dispatch, loading };
}

// Yup login validation schema
const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is Required"),
    password: Yup.string()
        .min(8, "Password must be atleast 8 characters")
        .required("Password is required")
})

// Yup registration validation schema
const registerValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name must be atleast 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .matches(/^[a-zA-Z\s-]+$/, "Name can only contain letters, spaces, and hyphens")
        .required("Name is required"),
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be atleast 8 characters")
        .required("Password is required"),
    passwordConfirmation: Yup.string()
        .oneOf([Yup.ref("password"), null], "Password must match")
        .required("Password confirmation is required"),
})


const AuthPage = () => {
    const [activeForm, setActiveForm] = useState("login");
    const { dispatch, loading } = useAuthentication();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(defaultAvatar);

    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors },
    } = useForm({ resolver: yupResolver(loginValidationSchema), });

    const {
        register: registerSignup,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors },
        setValue,
        setError,
        reset,
    } = useForm({ resolver: yupResolver(registerValidationSchema) })

    // Avatar upload
    const handleAvatarUpload = useCallback((e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) {
            setValue("avatar", null);
            setAvatarPreviewUrl(defaultAvatar);
            return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
            setError("avatar", { type: "manual", message: "File must be less than 2Mb" })
            setAvatarPreviewUrl(defaultAvatar);
            return;
        }

        if (!selectedFile.type.startsWith("image/")) {
            setError("avatar", { type: "manual", message: "Only images are allowed" })
            setAvatarPreviewUrl(defaultAvatar);
            return;
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setAvatarPreviewUrl(fileReader.result);
                setValue("avatar", selectedFile)
            }
        }
        fileReader.readAsDataURL(selectedFile);
    }, [setValue, setError])

    const onLoginSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await dispatch(login(data)).unwrap()
            setIsSubmitting(false)
        } catch (error) {
            setIsSubmitting(false)
        }
    }

    const onRegisterSubmit = async (data) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password)
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }
        await dispatch(register(formData)).unwrap()
            .then(() => {
                reset();
                setAvatarPreviewUrl(defaultAvatar)
            })
            .finally(() => setIsSubmitting(false))
    }

    if (loading) return <Loader />
    return (
        <div className='authContainer'>
            <div className='authCard'>
                <div className='formSelector'>
                    <button
                        type='button'
                        className={`selectorButton ${activeForm === "login" ? "active" : ""}`}
                        onClick={() => setActiveForm("login")}
                        aria-selected={activeForm === "login"}
                    >
                        Login
                    </button>
                    <button
                        type='button'
                        className={`selectorButton ${activeForm === "register" ? "active" : ""}`}
                        onClick={() => setActiveForm("register")}
                        aria-selected={activeForm === "register"}
                    >
                        Register
                    </button>
                </div>
                <div className='formContent'>
                    {activeForm === "login" ? (
                        <form onSubmit={handleLoginSubmit(onLoginSubmit)} className='authForm'>
                            <div className='inputGroup'>
                                <MailOutlineIcon />
                                <input
                                    {...registerLogin("email")}
                                    type='email'
                                    placeholder='Email Address'
                                    className={loginErrors.email ? "errorField" : ""}
                                />
                                {loginErrors.email && (
                                    <div className='errorMessage'>
                                        {loginErrors.email.message}
                                    </div>
                                )}
                            </div>
                            <div className='inputGroup'>
                                <LockOpenIcon />
                                <input
                                    {...registerLogin("password")}
                                    type='password'
                                    placeholder='Password'
                                    className={loginErrors.password ? "errorField" : ""}
                                />
                                {loginErrors.password && (
                                    <div className='errorMessage'>
                                        {loginErrors.password.message}
                                    </div>
                                )}
                            </div>
                            <Link to="/password/forgot">Forgot Password</Link>
                            <button type='submit' disabled={isSubmitting}>
                                {isSubmitting ? "Logging in.." : "Login"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className='authForm'>
                            <div className='inputGroup'>
                                <FaceIcon />
                                <input
                                    {...registerSignup("name")}
                                    type='text'
                                    placeholder='Full Name'
                                    className={registerErrors.name ? "errorField" : ""}
                                />
                                {registerErrors.name && (
                                    <div className='errorMessage'>
                                        {registerErrors.name.message}
                                    </div>
                                )}
                            </div>
                            <div className='inputGroup'>
                                <MailOutlineIcon />
                                <input
                                    {...registerSignup("email")}
                                    type="email"
                                    placeholder='Email Address'
                                    className={registerErrors.email ? "errorField" : ""}
                                />
                                {registerErrors.email && (
                                    <div className='errorMessage'>
                                        {registerErrors.email.message}
                                    </div>
                                )}
                            </div>
                            <div className='inputGroup'>
                                <LockOpenIcon />
                                <input
                                    {...registerSignup("password")}
                                    type='password'
                                    placeholder='Password'
                                    className={registerErrors.password ? "errorField" : ""}
                                />
                                {registerErrors.password && (
                                    <div className='errorMessage'>
                                        {registerErrors.password.message}
                                    </div>
                                )}
                            </div>
                            <div className='inputGroup'>
                                <LockOpenIcon />
                                <input
                                    {...registerSignup("passwordConfirmation")}
                                    type='password'
                                    placeholder='Confirm Password'
                                    className={registerErrors.passwordConfirmation ? "errorField" : ""}
                                />
                                {registerErrors.passwordConfirmation && (
                                    <div className='errorMessage'>
                                        {registerErrors.passwordConfirmation.message}
                                    </div>
                                )}
                            </div>
                            <div className='inputGroup avatarUploader'>
                                <img src={avatarPreviewUrl} alt="Profile avatar preview" />
                                <input
                                    accept='image/*'
                                    onChange={handleAvatarUpload}
                                    type="file"
                                />
                                {registerErrors.avatar && (
                                    <div className='errorMessage'>
                                        {registerErrors.avatar.message}
                                    </div>
                                )}
                            </div>
                            <button type='submit' disabled={isSubmitting}>
                                {isSubmitting ? "Registering.." : "Register"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AuthPage;