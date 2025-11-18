import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutList, Briefcase, Users, Search } from 'lucide-react'; // Using lucide-react for icons

// Define navigation links for each role
const NAV_LINKS = {
  freelancer: [
    { name: 'Home', path: '/freelancer/freelancerHome', icon: Briefcase },
    { name: 'Find Jobs', path: '/freelancer/searchJobs', icon: Search },
    { name: 'Proposals', path: '/freelancer/getPreposal', icon: LayoutList },
  ],
  client: [
    { name: 'Dashboard', path: '/client/home', icon: Briefcase },
    { name: 'Proposals', path: '/client/preposal', icon: LayoutList },
    // Assuming a path for posting new jobs
    { name: 'Post Job', path: '/client/addJob', icon: LayoutList }, 
  ],
  admin: [
    { name: 'Dashboard', path: '/admin/home', icon: Users },
    { name: 'Manage Users', path: '/admin/users', icon: LayoutList },
  ],
};

const Navbar = () => {
  const navigate = useNavigate();
  
  // 1. Determine the user's current role from local storage
  const userRole = localStorage.getItem('role'); 
  
  // Select the appropriate links based on the role, defaulting to empty if not logged in
  const linksToRender = NAV_LINKS[userRole] || [];

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // Redirect to the login page (or root, which redirects to login)
    navigate('/freelancer/login'); 
  };

  // Determine if the user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-2xl font-bold tracking-wider rounded-lg p-2 transition duration-300 hover:text-red-400">
               FreelancePortal
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && linksToRender.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition duration-200"
              >
                <link.icon className="w-4 h-4 mr-2" />
                {link.name}
              </Link>
            ))}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout ({userRole})
              </button>
            ) : (
              // Show general login/register links if not logged in
              <>
                <Link to="/freelancer/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Freelancer Login
                </Link>
                <Link to="/client/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Client Login
                </Link>
                   <Link to="/admin/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;