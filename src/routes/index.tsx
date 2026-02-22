import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "../pages/Homepage";
import AdminLogin from "../pages/AdminLogin";

export default function RoutesIndex() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Homepage} />
        <Route path="/admin/login" Component={AdminLogin} />
        {/* <Route path=`/admin/${import.meta.env.ADMIN_URL}/login` Component={AdminLogin} /> */}
        {/* <Route path="/dashboard/" Component={Dashboard} /> */}
      </Routes>
    </BrowserRouter>
  );
}