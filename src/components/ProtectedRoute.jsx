import React from 'react'
import { Navigate, Outlet } from 'react-router';

function ProtectedRoute({ childrens }) {

    const token = localStorage.getItem('token');

   return token ? <Outlet/> : <Navigate to="/login" />;
}

export default ProtectedRoute