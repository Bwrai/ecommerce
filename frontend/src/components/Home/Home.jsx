import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";
import Metadata from "../layout/Metadata.jsx"
import { clearErrors, getProducts } from "../../features/productSlice.js";
import Loader from "../layout/Loader/Loader.jsx";
import { showAlert } from "../../features/alertSlice.js";
import { v4 as uuidv4 } from 'uuid';
import ProductCard from "./ProductCard.jsx";


function Home() {
  const dispatch = useDispatch();
  const { products, loading, error, productsCount } = useSelector((state) => state.product)
  const preErrorRef = useRef(null);

  useEffect(() => {
    dispatch(getProducts())
    
  }, [dispatch])
  useEffect(() => {
    if (error && error !== preErrorRef.current) {
      preErrorRef.current = error;
      dispatch(showAlert({
        id: uuidv4(),
        type: "error",
        message: error
      }));
      dispatch(clearErrors());
    }
  }, [dispatch, error])

  return (
    <>
      {loading ? <Loader /> :
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
                <ProductCard key={product._id} product={product} />
              ))
            }
          </div>
        </>
      }
    </>
  );
}

export default Home;
