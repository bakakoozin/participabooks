import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Work from "../pages/Work";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/works/:id" element={<Work />} />
        </Routes>
    );
}

export default AppRoutes;