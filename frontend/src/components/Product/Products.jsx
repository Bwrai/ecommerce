import React, { useEffect, useRef, useState, useCallback } from 'react';
import "./Products.css";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getProducts } from '../../features/productSlice';
import ProductCard from '../Home/ProductCard';
import Loader from '../layout/Loader/Loader';
import { showAlert } from '../../features/alertSlice';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

// Simple debounce function
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
    const preErrorRef = useRef(null);

    const { products, loading, error, resultPerPage, productsCount } = useSelector(state => state.product);

    const [currentPage, setCurrentPage] = useState(1);
    // Separate state for slider value and actual filter price
    const [sliderValue, setSliderValue] = useState([0, 100000]);
    const [priceFilter, setPriceFilter] = useState([0, 100000]);

    const pageLimit = resultPerPage ?? 8;
    const pageCount = productsCount ? Math.ceil(productsCount / pageLimit) : 1;

    const handlePageClick = ({ selected }) => {
        const newPage = selected + 1;
        setCurrentPage(newPage);
        fetchProducts(newPage);
    };

    // Handle slider changes without immediate filtering
    const priceHandler = (event, newValue) => {
        setSliderValue(newValue);
    };

    // Debounced function to apply the filter
    const applyPriceFilter = useCallback(
        debounce((newPrice) => {
            setPriceFilter(newPrice);
        }, 500),
        []
    );

    // Call debounced filter when slider value changes
    useEffect(() => {
        applyPriceFilter(sliderValue);
    }, [sliderValue]);

    const fetchProducts = (page = currentPage) => {
        dispatch(getProducts({
            keyword: keyword || "",
            page,
            limit: pageLimit,
            price: priceFilter // Use the debounced price filter
        }));
    };

    // Only fetch when actual filter or page changes
    useEffect(() => {
        fetchProducts();
    }, [dispatch, keyword, priceFilter, currentPage]);

    useEffect(() => {
        if (error && error !== preErrorRef.current) {
            preErrorRef.current = error;
            dispatch(showAlert({ id: uuidv4(), type: error, message: error }));
            dispatch(clearErrors());
        }
    }, [dispatch, error]);

    if (loading) return <Loader />;

    return (
        <>
            <h2 className='productsHeading'>Products {keyword ? `for "${keyword}"` : ''}</h2>

            <div className='productsView'>
                <div className='products'>
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <p className='noProductsFound'>No products found!</p>
                    )}
                </div>

                <div className='filterBox'>
                    <Typography>
                        Price Range:
                        <p> ₹{sliderValue[0]} - ₹{sliderValue[1]}</p>
                        <Slider
                            value={sliderValue}
                            size='small'
                            onChange={priceHandler}
                            valueLabelDisplay="auto"
                            min={0}
                            max={250000}
                            aria-label="Price range filter"
                        />
                    </Typography>
                </div>
            </div>

            {productsCount > pageLimit && (
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