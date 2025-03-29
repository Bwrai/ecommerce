import {  useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { showAlert } from '../../features/alertSlice';
import { v4 as uuidv4 } from 'uuid';
import { clearErrors } from '../../features/User/userSlice';

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

export default useAuthentication;