import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand" onClick={closeMobile}>
          <div className="brand-icon">
            <Shield size={20} />
          </div>
          <span>ScamShield AI</span>
        </Link>

        <button className="mobile-menu-btn" onClick={toggleMobile} aria-label="Toggle Navigation">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobile}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobile}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/analyze" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobile}>
              Analyze
            </NavLink>
          </li>
          <li>
            <NavLink to="/history" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobile}>
              History
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobile}>
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
