import React, { useEffect, useRef } from 'react'
import "./Products.css"
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getProducts } from '../../features/productSlice';
import ProductCard from '../Home/ProductCard';
import Loader from '../layout/Loader/Loader';
import { showAlert } from '../../features/alertSlice';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';

const Products = () => {

    const { products, loading, error } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const preErrorRef = useRef(null);
    const { keyword } = useParams();

    useEffect(() => {
        dispatch(getProducts({ keyword: keyword || "" }))
    }, [dispatch, keyword])

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
        </>
    )
}

export default Products