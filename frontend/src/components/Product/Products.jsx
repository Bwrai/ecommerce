import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProducts } from "../../features/productSlice";
import ProductCard from "../Home/ProductCard";
import Loader from "../layout/Loader/Loader";
import { showAlert } from "../../features/alertSlice";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

const categories = [
  "Laptop",
  "Mobile",
  "T-Shirts",
  "Camera",
  "Footwear",
  "Books",
  "Home Appliances",
  "Clothing"
]

// Utility: Debounce function to optimize API calls
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Products = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();
  const prevErrorRef = useRef(null);

  const { products, loading, error, resultPerPage, productsCount, filteredProductsCount } = useSelector(
    (state) => state.product
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [sliderValue, setSliderValue] = useState([0, 100000]);
  const [priceFilter, setPriceFilter] = useState([0, 100000]);
  const [category, setCategory] = useState("");

  const pageLimit = resultPerPage || 8;
  const validProductsCount = filteredProductsCount || productsCount;

  // Memoized page count calculation
  const pageCount = useMemo(() => (validProductsCount ? Math.ceil(validProductsCount / pageLimit) : 1), [
    validProductsCount,
    pageLimit,
  ]);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  // Handle slider changes
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  // Debounced function to apply price filter
  const applyPriceFilter = useMemo(
    () =>
      debounce((newPrice) => {
        setPriceFilter(newPrice);
      }, 500),
    []
  );
  

  useEffect(() => {
    applyPriceFilter(sliderValue);
  }, [sliderValue, applyPriceFilter]);

  // Fetch products when dependencies change
  useEffect(() => {
    dispatch(
      getProducts({
        keyword: keyword || "",
        page: currentPage,
        limit: pageLimit,
        price: priceFilter,
        category,
      })
    );
  }, [ keyword, priceFilter, currentPage, category]);

  //Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setCurrentPage(1);
  }

  // Handle API errors
  useEffect(() => {
    if (error && error !== prevErrorRef.current) {
      prevErrorRef.current = error;
      dispatch(showAlert({ id: uuidv4(), type: "error", message: error }));
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  if (loading) return <Loader />;

  return (
    <>
      <h2 className="productsHeading">Products {keyword ? `for "${keyword}"` : ""}</h2>

      <div className="productsView">
        <div className="products">
          {products.length > 0 ? (
            products.map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <p className="noProductsFound">No products found!</p>
          )}
        </div>

        <div className="filterBox">
          <Typography>
            Price Range:
            <p>₹{sliderValue[0]} - ₹{sliderValue[1]}</p>
            <Slider
              value={sliderValue}
              size="small"
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={250000}
              aria-label="Price range filter"
            />
          </Typography>

          {/* Category Filter Box */}
          <Typography>
            Category
            <select value={category} onChange={handleCategoryChange} className="categoryFilter">
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </Typography>
        </div>
      </div>

      {validProductsCount > pageLimit && products.length > 0 && (
        <div className="pagination-container">
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            previousLabel="< Previous"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
            forcePage={currentPage - 1}
          />
        </div>
      )}
    </>
  );
};

export default Products;
