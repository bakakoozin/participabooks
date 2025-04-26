import { Route, Routes } from "react-router-dom";

import { ShelfWorkDetails } from "../pages/user/ShelfWorkDetails";
import { UpdateUserForm } from "../pages/user/UpdateUserForm";
import { CreateVolume } from "../pages/user/CreateVolume";
import { AdminDashboard } from "../pages/admin/Admin";
import { EditVolume } from "../pages/user/EditVolume";
import { Dashboard } from "../pages/user/Dashboard";
import { ProtectedRoute } from "./ProtectedRoutes";
import { CreateWork } from "../pages/user/Create";
import { EditWork } from "../pages/user/EditWork";
import { Register } from "../pages/auth/Register";
import { NotFound } from "../pages/NotFound";
import { Shelf } from "../pages/user/Shelf";
import { Login } from "../pages/auth/Login";
import { Legal } from "../pages/Legal";
import { Home } from "../pages/Home";
import { Work } from "../pages/Work";
import { CGU } from "../pages/CGU";

export function AppRoutes() {
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
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="cgu" element={<CGU />} />
      <Route path="legal" element={<Legal />} />
      <Route path="/admin/*" element={<NotFound />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
