import React, { type JSX } from 'react';
import type { RootState } from '@/redux/rootReducer'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: JSX.Element;
  allowRoles: ("admin" | "teacher" | "student" | "parent")[];
}

const ProtectedRoute = ({ children, allowRoles }: ProtectedRouteProps) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { role, currentUser } = useSelector((state: RootState) => state.user);

    if (!token || !currentUser) {
        return <Navigate to={'/auth'} />
    } else if (!allowRoles.includes(role!)) { // role! - ?
        return (
            <>
                <div className="">
                    <h1> Error 404 -- Page Not Found </h1>
                </div>
            </>
        )
    }

    return children;
}

export default ProtectedRoute