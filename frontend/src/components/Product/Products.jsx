import React, { useEffect, useRef, useState } from 'react'
import "./Products.css"
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getProducts } from '../../features/productSlice';
import ProductCard from '../Home/ProductCard';
import Loader from '../layout/Loader/Loader';
import { showAlert } from '../../features/alertSlice';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const Products = () => {

    const {
        products,
        loading,
        error,
        resultPerPage,
        productsCount,
    } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const preErrorRef = useRef(null);
    const { keyword } = useParams();

    const [currentPage, setCurrentPage] = useState(1);

    const pageLimit = resultPerPage ?? 8;
    const pageCount = productsCount ? Math.ceil(productsCount / pageLimit) : 1;

    // Handle page change
    const handlePageClick = (e) => {
        const newPage = e.selected + 1;
        setCurrentPage(newPage)
        dispatch(getProducts({
            keyword: keyword || "",
            page: newPage,
            limit: pageLimit
        }))
    }

    useEffect(() => {
        dispatch(getProducts({
            keyword: keyword || "",
            page: currentPage,
            limit: pageLimit
        }))
    }, [dispatch, keyword, currentPage, pageLimit])

    useEffect(() => {
        if (error && error !== preErrorRef.current) {
            preErrorRef.current = error;
            dispatch(showAlert({
                id: uuidv4(),
                type: error,
                message: error
            }))
            dispatch(clearErrors())
        }
    }, [dispatch, error])

    if (loading) return <Loader />
    return (
        <>
            <h2 className='productsHeading'>Products {keyword ? `for "${keyword}"` : ''}</h2>
            <div className='products'>
                {products.length > 0 ? (
                    products?.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <p className='noProductsFound'>No products found!</p>
                )}
            </div>
            {/* Pagination Controls */}
            {productsCount > pageLimit && (
                <div className="pagination-container">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="Next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={pageCount}
                        previousLabel="< Previous"
                        renderOnZeroPageCount={null}
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
                        forcePage={currentPage - 1} // 0-based index
                    />
                </div>
            )}
        </>
    )
}

export default Products