import React from "react";
import "./Header.css";
import { FaCartShopping } from "react-icons/fa6";
import { MdSearch } from "react-icons/md";
import { MdPermContactCalendar } from "react-icons/md";

function Header() {
  return (
    <nav>
      <div className="nav-container">
        <div>
          <h1 className="logo">BwraiMart</h1>
        </div>
        <div className="menu container">
          <ul className="nav-menu">
            <li className="nav-item">Home</li>
            <li className="nav-item">Product</li>
            <li className="nav-item">Contact</li>
            <li className="nav-item">About</li>
            <div className="icons">
              <a className="icon" href="#">
                <MdSearch />
              </a>
              <a className="icon" href="#">
                <FaCartShopping />
              </a>
              <a className="icon" href="#">
                <MdPermContactCalendar />
              </a>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
