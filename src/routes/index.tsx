import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "../pages/Homepage";
import AdminLogin from "../pages/AdminLogin";
import AdminHome from "../pages/AdminHome.tsx";
import About from "../pages/About.tsx";

export default function RoutesIndex() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Homepage} />
        <Route path="/about" Component={About} />
        <Route path="/admin/login" Component={AdminLogin} />
        {/* <Route path={`/admin/${import.meta.env.ADMIN_URL}/login`} Component={AdminLogin} /> */}
        <Route path="/admin/home" Component={AdminHome} />
        {/* <Route path={`/admin/${import.meta.env.ADMIN_URL}/home`} Component={AdminHome} /> */}
      </Routes>
    </BrowserRouter>
  );
}
