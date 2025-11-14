import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center  bg-black text-white font-bold p-5  pr-10 pl-10 w-full static'>
      <h2>FreelanceHub</h2>

      <ul className='flex gap-7 list-none '>
        <li><Link to="/freelancer/freelacerHome">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/freelancer/login">Login</Link></li>
        <li><Link to="/freelancer/register">Register</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
