import { Route, Navigate, Outlet } from 'react-router-dom'
import {authSlice} from '../store/auth-slice'   

function PrivateRoute(isLoggedIn) {
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
  }

export default PrivateRoute;