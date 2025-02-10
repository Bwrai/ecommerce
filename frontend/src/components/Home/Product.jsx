import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import "./Product.css";

const options = {
  edit: false,
  color: "rgba(20, 20, 20, 0.1)",
  activeColor: "tomato",
  size: window.innerWidth < 600 ? 20 : 25,
  value: 2.5,
  isHalf: true,
};

const Product = ({ product }) => {
  return (
    <Link className="productCard">
      <div className="image">
        <img src={product.images[0].url} alt={product.name} />
      </div>

      <p>{product.name}</p>
      <div className="reviews_section">
        <span>
          <p className="react_stars">
            <ReactStars {...options} />
          </p>
          <span>(256 reviews)</span>
        </span>
        <span>₹{product.price}</span>
      </div>
    </Link>
  );
};

export default Product;
