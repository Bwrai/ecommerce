import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';

const ProtectedRoute = ({ isAdmin = false }) => {

    const { loading, isAuthenticated, user } = useSelector((state) => state.user);

    if (loading || user === null) return <Loader />;

    if (!isAuthenticated) return <Navigate to={'/login'} replace />

    if (isAdmin && user?.role !== "admin") return <Navigate to={'/login'} replace />

    return <Outlet />
}

export default ProtectedRoute