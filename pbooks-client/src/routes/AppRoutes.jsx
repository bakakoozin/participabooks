import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Work from "../pages/Work";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/user/Dashboard";
import ProtectedRoute from "./ProtectedRoutes";
import UpdateUserForm from "../pages/user/UpdateUserForm";
import Shelf from "../pages/user/Shelf";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="shelf" element={<Shelf />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="update-infos"
        element={
          <ProtectedRoute>
            <UpdateUserForm />
          </ProtectedRoute>
        }
      />
      <Route path="/works/:id" element={<Work />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;
