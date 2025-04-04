import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import Work from "../pages/Work";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/user/Dashboard";
import ProtectedRoute from "./ProtectedRoutes";
import UpdateUserForm from "../pages/user/UpdateUserForm";
import Shelf from "../pages/user/Shelf";
import ShelfWorkDetails from "../pages/user/ShelfWorkDetails";
import { CreateWork } from "../pages/user/Create";
import{ EditVolume } from "../pages/user/EditVolume";
import { CreateVolume } from "../pages/user/CreateVolume";
import { EditWork } from "../pages/user/EditWork";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/works/:id" element={<Work />} />
      <Route
        path="/works/:id/edit"
        element={
          <ProtectedRoute>
            <EditWork />
          </ProtectedRoute>
        }
      />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
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
      <Route
        path="shelf"
        element={
          <ProtectedRoute>
            <Shelf />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shelf/work/:id"
        element={
          <ProtectedRoute>
            <ShelfWorkDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="creator"
        element={
          <ProtectedRoute>
            <CreateWork />
          </ProtectedRoute>
        }
      />
      <Route
        path="editVol/:volumeId"
        element={
          <ProtectedRoute>
            <EditVolume />
          </ProtectedRoute>
        }
      />
      <Route
        path="editWork/:workId"
        element={
          <ProtectedRoute>
            <EditWork />
          </ProtectedRoute>
        }
      />
      <Route
        path="createVol/:workId"
        element={
          <ProtectedRoute>
            <CreateVolume />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
