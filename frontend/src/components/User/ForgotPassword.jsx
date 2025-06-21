import "./ForgotPassword.css";
import Metadata from '../layout/Metadata';
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { clearErrors, clearMessage, forgotPassword } from '../../features/User/userSlice';
import { v4 as uuidv4 } from 'uuid';
import { showAlert } from '../../features/alertSlice';
import { useEffect, useRef, useState } from 'react';

const ForgotPassword = () => {

    const dispatch = useDispatch();
    const { error, message, loading } = useSelector((state) => state.user)
    const [email, setEmail] = useState("");
    const preErrorRef = useRef(null);
    const preMessageRef = useRef(null);

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("email", email)
        dispatch(forgotPassword(formData))
    }
    useEffect(() => {
        if (error && error !== preErrorRef.current) {
            preErrorRef.current = error;
            dispatch(
                showAlert({
                    id: uuidv4(),
                    type: 'error',
                    message: error,
                })
            );
            dispatch(clearErrors());
        }
        if (message && message !== preMessageRef.current) {
            preMessageRef.current = message;
            dispatch(
                showAlert({
                    id: uuidv4(),
                    type: "success",
                    message: "Password Reset link sent successfully"
                })
            )
            dispatch(clearMessage());
        }
    }, [error, message, dispatch])


    if (loading) return <Loader />
    return (
        <>
            <Metadata title="Forgot Password" />
            <section className='form-wrapper'>
                <div className='form-container'>
                    <h2 className='form-header'>Reset Your Password</h2>
                    <p className='form-subcontent'>Enter your email to reset your Password</p>

                    <form onSubmit={forgotPasswordSubmit} className='form-body'>
                        <div className='input-group'>
                            <MailOutlineIcon className='input-icon' />
                            <input
                                type="email"
                                placeholder='Email Address'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='input-field'
                            />
                        </div>
                        <button type='submit' className='submit-button' disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default ForgotPassword;