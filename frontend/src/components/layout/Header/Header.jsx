import React, { useState } from "react";
import "./Header.css";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { MdSearch, MdMenu, MdClose } from "react-icons/md";
import { Link } from "react-router-dom";


function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <Link to={`/`}>
          <h1 className="logo">BwraiMart
          </h1></Link>

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
            <Link to={`/`}>Home</Link>
            <Link to={`/products`}>Products</Link>
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
