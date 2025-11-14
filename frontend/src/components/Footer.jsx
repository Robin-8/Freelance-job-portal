const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">FreelanceHub</h2>
          <p className="text-gray-400 text-sm leading-6">
            Connecting clients with talented freelancers.  
            Find jobs, hire experts, and grow your business—all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Browse Jobs</a></li>
            <li><a href="#" className="hover:text-white">Post a Job</a></li>
            <li><a href="#" className="hover:text-white">My Proposals</a></li>
            <li><a href="#" className="hover:text-white">Dashboard</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <p className="text-sm text-gray-400">📧 support@freelancehub.com</p>
          <p className="text-sm text-gray-400 mt-2">📍 Kochi, Kerala, India</p>

          {/* Social Icons */}
          <div className="flex items-center space-x-4 mt-4 text-xl">
            <a href="#" className="hover:text-white">🌐</a>
            <a href="#" className="hover:text-white">📘</a>
            <a href="#" className="hover:text-white">📸</a>
            <a href="#" className="hover:text-white">🐦</a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FreelanceHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
