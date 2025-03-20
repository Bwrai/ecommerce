import React, { useState } from 'react'
import "./AuthPage.css"

const AuthPage = () => {
    const [activeForm, setActiveForm] = useState("login");
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
                        <div>Login Form PlaceHolder</div>
                    ) : (
                        <div>Register Form PlaceHolder</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AuthPage;