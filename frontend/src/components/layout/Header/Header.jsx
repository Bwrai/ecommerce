import React, { useState } from "react";
import "./Header.css";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { MdSearch, MdMenu, MdClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../features/productSlice";
import Metadata from "../Metadata";
import UserOptions from "./UserOptions";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    dispatch(getProducts({ keyword: trimmedKeyword }));
    navigate(trimmedKeyword ? `/products/search/${encodeURIComponent(trimmedKeyword)}` : "/products");
  };

  return (
    <>
      <Metadata title="Search a Product" />
      <header className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="logo">
            <h1>BwraiMart</h1>
          </Link>

          {/* Search Bar */}
          <div className="search-bar">
            <form onSubmit={searchSubmitHandler}>
              <input
                type="text"
                placeholder="Search for products, brands, and more"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit" className="search-button" aria-label="Search">
                <MdSearch />
              </button>
            </form>
          </div>

          {/* Navigation */}
          <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>

            {/* Icons */}
            <div className="nav-icons">
              {isAuthenticated ? (
                <UserOptions user={user} />
              ) : (
                <Link to="/login" aria-label="Login">
                  <FaUserCircle className="icon" />
                </Link>
              )}
              <Link to="/cart" aria-label="Cart">
                <FaShoppingCart className="icon" />
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
