import React, { useState } from 'react'
import useAuthentication from './useAuthHook';
import defaultAvatar from "../../images/profile.png"
import "./AuthPage.css"
import Loader from '../layout/Loader/Loader';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
    const [activeForm, setActiveForm] = useState("login");
    const { dispatch, loading } = useAuthentication();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(defaultAvatar);

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
                        <LoginForm
                            dispatch={dispatch}
                            isSubmitting={isSubmitting}
                            setIsSubmitting={setIsSubmitting} />
                    ) : (
                        <RegisterForm
                            dispatch={dispatch}
                            avatarPreviewUrl={avatarPreviewUrl}
                            setAvatarPreviewUrl={setAvatarPreviewUrl}
                            isSubmitting={isSubmitting}
                            setIsSubmitting={setIsSubmitting} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default AuthPage;