import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      
      <Navbar />
      
      <main className="flex-grow bg-black">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
