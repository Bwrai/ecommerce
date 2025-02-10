import React, { Fragment } from "react";
import Product from './Product.jsx'
import "./Home.css";

const product = {
    name: 'Black T-shirt',
    images: [{url: "https://media.istockphoto.com/id/488160041/photo/mens-shirt.jpg?s=612x612&w=0&k=20&c=xVZjKAUJecIpYc_fKRz_EB8HuRmXCOOPOtZ-ST6eFvQ="}],
    price: "5000",
    _id: "manveer"
}

function Home() {
  return (
    <>
      <div className="banner">
        <p>Welcome to BwraiMart</p>
        <h1>Shopping made easy with BwraiMart</h1>
      </div>
      <div>
        <h2 className="productHeading">Featured Products</h2>
      </div>
      <div className="container">
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
      </div>
    </>
  );
}

export default Home;
