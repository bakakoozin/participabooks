import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Work from "../pages/Work";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/works/:id" element={<Work />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/login" element={<Login />} />
            
        </Routes>
    );
}

export default AppRoutes;