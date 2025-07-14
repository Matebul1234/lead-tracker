import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, User, X } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/navbar.css'; 

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const username = localStorage.getItem("username");

  const toggleNavbar = () => {
    setIsOpen(!isOpen); 
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    // remove any other user tokens if you have
    closeNavbar();
    navigate('/login'); // redirect to login
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light shadow-sm fixed-top px-3" style={{height:'auto', background: 'linear-gradient(90deg, #0240af, #021968)'}}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Logo on the left */}
        <div className="navbar-brand"  onClick={closeNavbar}>
          <img src="/logo.webp" alt="Logo" width="120px" className="d-block h-100 object-fit-cover" />
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler text-white"
          type="button"
          onClick={toggleNavbar}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navbar Links */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-md-0 customeNavbar">
            <li className="nav-item d-flex align-items-center text-white px-2">
              <User className="me-1" /> {username ? `Hi.. ${username}` : 'Hi.. Matty'}
            </li>

            {username && (
              <li className="nav-item">
                <button 
                  className="btn btn-link nav-link text-white" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
