import { useEffect, useRef, useState } from 'react'
import "./ResetPassword.css"
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import { clearErrors, clearMessage, resetPassword } from "../../features/User/userSlice"
import { showAlert } from '../../features/alertSlice';
import { v4 as uuidv4 } from 'uuid';

const ResetPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();

    const { error, success, loading } = useSelector((state) => state.user)

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const prevErrorRef = useRef(null);
    const prevMessageRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            dispatch(
                showAlert({
                    id: uuidv4(),
                    type: "error",
                    message: "Passwords do not match",
                })
            );
            return;
        }
        const formData = new FormData();
        formData.set("password", password);
        formData.set("confirmPassword", confirmPassword)
        dispatch(resetPassword({ token, formData }))
    }

    useEffect(() => {
        if (error && error !== prevErrorRef.current) {
            prevErrorRef.current = error;
            dispatch(
                showAlert({
                    id: uuidv4(),
                    type: "error",
                    message: error
                })
            )
            dispatch(clearErrors())
        }
        if (success && success !== prevMessageRef.current) {
            prevMessageRef.current = success;
            dispatch(
                showAlert({
                    id: uuidv4(),
                    type: "success",
                    message: "Password updated successfully",
                })
            );
            dispatch(clearMessage());
            navigate("/login");
        }
    }, [error, success, dispatch, navigate]);

    if (loading) return <Loader />
    return (
        <>
            <div className='password-reset-wrapper'>
                <div className='password-reset-box'>
                    <h2 className='password-reset-title'>Reset your password</h2>
                    <form className='password-reset-form' onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <LockOpenIcon className='form-icon' />
                            <input
                                type="password"
                                placeholder='New Password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <LockIcon className='form-icon' />
                            <input
                                type="password"
                                placeholder='Confirm Password'
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className='password-reset-button'>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ResetPassword;