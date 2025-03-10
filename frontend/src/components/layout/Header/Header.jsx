import React, { useState } from "react";
import "./Header.css";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { MdSearch, MdMenu, MdClose } from "react-icons/md";
import { Link, Meta, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProducts } from "../../../features/productSlice";
import Metadata from "../Metadata";


function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    dispatch(getProducts({ keyword: trimmedKeyword }))
    navigate(trimmedKeyword ? `/products/search/${encodeURIComponent(trimmedKeyword)}` : '/products')
  }


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
        <Metadata title="search a product" />
        <div className="search-bar">
          <form onSubmit={searchSubmitHandler}>
            <input
              type="text"
              placeholder="Search for products, brands, and more"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
              aria-label="search a product"
            />
            <button className="search-button" type="submit">
              <MdSearch />
            </button>
          </form>
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
