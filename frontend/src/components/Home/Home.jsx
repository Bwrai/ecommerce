import React, { Fragment, useEffect } from "react";
import Product from './Product.jsx'
import "./Home.css";
import Metadata from "../layout/Metadata.jsx"
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProducts } from "../../features/productSlice.js";


function Home() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(getProducts())

    return () => {
      if(products.length === 0) dispatch(clearErrors())
    }
  }, [dispatch])
  return (
    <>
      <Metadata title="BwraiMart" />
      <div className="banner">
        <p>Welcome to BwraiMart</p>
        <h1>Shopping made easy with BwraiMart</h1>
      </div>
      <div>
        <h2 className="productHeading">Featured Products</h2>
      </div>
      <div className="container">

        {
          products && products.map((product) => (
            <Product key={product._id} product={product} />
          ))
        }
      </div>
    </>
  );
}

export default Home;
