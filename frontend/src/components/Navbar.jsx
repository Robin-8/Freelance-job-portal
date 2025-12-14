import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, LayoutList, Briefcase, Users, Search, Menu, X } from "lucide-react";

const NAV_LINKS = {
  freelancer: [
    { name: "Home", path: "/freelancer/freelancerHome", icon: Briefcase },
    { name: "Find Jobs", path: "/freelancer/searchJobs", icon: Search },
    { name: "Proposals", path: "/freelancer/getPreposal", icon: LayoutList },
  ],
  client: [
    { name: "Dashboard", path: "/client/home", icon: Briefcase },
    { name: "Proposals", path: "/client/preposal", icon: LayoutList },
    { name: "Post Job", path: "/client/addJob", icon: LayoutList },
  ],
  admin: [
    { name: "Dashboard", path: "/admin/home", icon: Users },
    { name: "Manage Users", path: "/admin/users", icon: LayoutList },
  ],
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const userRole = localStorage.getItem("role");
  const linksToRender = NAV_LINKS[userRole] || [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/freelancer/login");
  };

  const isAuthenticated = !!localStorage.getItem("token");

  // Determine which login to show based on current path
  const currentPath = location.pathname;
  let loginLink;
  if (currentPath.startsWith("/freelancer")) {
    loginLink = { name: "Freelancer Login", path: "/freelancer/login" };
  } else if (currentPath.startsWith("/client")) {
    loginLink = { name: "Client Login", path: "/client/login" };
  } else {
    // Default: show freelancer login
    loginLink = { name: "Freelancer Login", path: "/freelancer/login" };
  }

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link
            to="/"
            className="text-white text-2xl font-bold tracking-wide hover:text-red-400 transition"
          >
            FreelancePortal
          </Link>

          {/* MOBILE BUTTON */}
          <button
            className="text-white lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated &&
              linksToRender.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm flex items-center transition"
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Link>
              ))}

            {!isAuthenticated && (
              <Link
                to={loginLink.path}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm"
              >
                {loginLink.name}
              </Link>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
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
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm flex items-center"
              >
                <link.icon className="w-4 h-4 mr-2" />
                {link.name}
              </Link>
            ))}

          {!isAuthenticated && (
            <Link
              to={loginLink.path}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm"
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
              className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout ({userRole})
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
