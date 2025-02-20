import React, { useState } from "react";
import "./Header.css";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { MdSearch, MdMenu, MdClose } from "react-icons/md";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <h1 className="logo">BwraiMart</h1>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search for products, brands, and more" />
          <button className="search-button">
            <MdSearch />
          </button>
        </div>

        {/* Desktop Navigation Icons */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Products</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">About</a></li>
          </ul>

          {/* Navbar Icons */}
          <div className="nav-icons">
            <FaUserCircle className="icon" />
            <FaShoppingCart className="icon" />
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <MdClose /> : <MdMenu />}
        </button>
      </div>
    </header>
  );
}

export default Header;
