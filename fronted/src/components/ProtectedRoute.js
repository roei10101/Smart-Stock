import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const token = localStorage.getItem('authToken');
    // אם אין טוקן, העבר לעמוד ההתחברות
    if (!authToken) {
        return <Navigate to="/login" replace />;
    }
    // אם יש טוקן, הצג את התוכן של העמוד המוגן
    return <Outlet />;
}

export default ProtectedRoute;