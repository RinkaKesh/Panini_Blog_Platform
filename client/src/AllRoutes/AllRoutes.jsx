import React,{useContext,useEffect,useState} from 'react'
import Home from '../Pages/Home'
import Register from '../Pages/Register'
import Login from '../Pages/Login'
import Blogs from '../Pages/Blogs'
import Profile from '../Pages/Profile'
import { Routes,Route,Navigate,useNavigate } from 'react-router-dom'
import { AuthContext } from "../Context/AuthProvider";
import { isAuth } from '../fun'
import {toast} from 'react-toastify'

const AllRoutes = () => {
  const navigate = useNavigate();

  const ProtectedRoute = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(isAuth());
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkAuth = () => {
        if (!isAuth()) {
          console.warn("Session expired");
          // toast.warning("Session expired. Login Again");
          navigate("/login", { replace: true });
        }
      };
  
      checkAuth(); 
  
      const interval = setInterval(checkAuth, 5000); 
  
      return () => clearInterval(interval); 
    }, [navigate]);
  
    return authenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs"
        element={
          <ProtectedRoute>
            <Blogs />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AllRoutes;