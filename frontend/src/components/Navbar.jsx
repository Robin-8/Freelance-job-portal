import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutList,
  Briefcase,
  Users,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slice/clientSlice";

/* ---------------- ROLE BASED NAV LINKS ---------------- */

const NAV_LINKS = {
  freelancer: [
    {
      name: "Home",
      path: "/freelancer/freelancerHome",
      icon: Briefcase,
    },
    {
      name: "Find Jobs",
      path: "/freelancer/searchJobs",
      icon: Search,
    },
    {
      name: "Proposals",
      path: "/freelancer/getPreposal",
      icon: LayoutList,
    },
  ],
  client: [
    {
      name: "Dashboard",
      path: "/client/home",
      icon: Briefcase,
    },
    {
      name: "Proposals",
      path: "/client/preposal",
      icon: LayoutList,
    },
    {
      name: "Post Job",
      path: "/client/addJob",
      icon: LayoutList,
    },
  ],
  admin: [
    {
      name: "Dashboard",
      path: "/admin/home",
      icon: Users,
    },
    {
      name: "Manage Users",
      path: "/admin/userMgt",
      icon: LayoutList,
    },
    {
      name: "Jobs",
      path: "/admin/getAdminJobs",
      icon: Briefcase,
    },
  ],
};

/* ---------------- NAVBAR COMPONENT ---------------- */

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, token } = useSelector((state) => state.client);

  const isAuthenticated = !!token;
  const userRole = user?.role?.toLowerCase();
  const linksToRender = NAV_LINKS[userRole] || [];

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = () => {
    dispatch(logout());

    if (userRole === "admin") navigate("/admin/login");
    else if (userRole === "client") navigate("/client/login");
    else navigate("/freelancer/login");
  };

  /* ---------------- LOGIN LINK (PUBLIC) ---------------- */

  const currentPath = location.pathname;

  let loginLink =
    currentPath.startsWith("/admin")
      ? { name: "Admin Login", path: "/admin/login" }
      : currentPath.startsWith("/client")
      ? { name: "Client Login", path: "/client/login" }
      : { name: "Freelancer Login", path: "/freelancer/login" };

  /* ---------------- RENDER ---------------- */

  return (
    <nav className="bg-gray-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link
            to="/"
            className="text-white text-xl font-bold tracking-wide"
          >
            FreelancePortal
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            className="text-white lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated &&
              linksToRender.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-300 hover:text-white flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition"
                >
                  <link.icon size={16} />
                  {link.name}
                </Link>
              ))}

            {!isAuthenticated && (
              <Link
                to={loginLink.path}
                className="text-gray-300 hover:text-white px-3 py-2 rounded hover:bg-gray-700"
              >
                {loginLink.name}
              </Link>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout ({userRole})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-900 px-4 pb-4 space-y-2">
          {isAuthenticated &&
            linksToRender.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-300 hover:text-white px-3 py-2 rounded hover:bg-gray-700"
              >
                {link.name}
              </Link>
            ))}

          {!isAuthenticated && (
            <Link
              to={loginLink.path}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 hover:text-white px-3 py-2 rounded hover:bg-gray-700"
            >
              {loginLink.name}
            </Link>
          )}

          {isAuthenticated && (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout ({userRole})
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
