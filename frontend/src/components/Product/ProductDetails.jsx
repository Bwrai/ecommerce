import React, { useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel';
import './ProductDetails.css';
import { getProductDetails } from '../../features/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component'
import ReviewCard from './ReviewCard';


const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.product);

    //States
    const [quantity, setQuantity] = useState(1);

    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value: product.ratings || 0,
        isHalf: true,
    };

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id])

    const updateQuantity = (type) => {
        setQuantity((prev) => {
            if (type === "increase" && prev < product.stock) return prev + 1;
            if (type === "decrease" && prev > 1) return prev - 1;
            return prev;
        })
    }
    return (
        <>
            <div className='ProductDetails'>
                <div>
                    <Carousel>
                        {
                            product?.images?.map((item, i) => (
                                <img
                                    src={item.url}
                                    alt={`${i} Slide`}
                                    key={item.url}
                                    className='ImageCarousel'
                                />
                            ))
                        }
                    </Carousel>
                </div>
                <div>
                    <div className='details-block-1'>
                        <h2>{product.name}</h2>
                        <p>Product # {product._id}</p>
                    </div>
                    <div>
                        <ReactStars {...options} />
                        <span className='details-block-2'>
                            {" "}
                            ({product.numOfReviews} Reviews)</span>
                    </div>

                    <div className='details-block-3'>
                        <h1>{`₹ ${product.price}`}</h1>
                        <div className='detils-block-3-1'>
                            <div className='details-block-3-1-1'>
                                <button onClick={() => updateQuantity("decrease")}>-</button>
                                <input type="number" readOnly value={quantity} />
                                <button onClick={() => updateQuantity("increase")}>+</button>
                            </div>
                            <button
                                disabled={product.stock < 1 ? true : false}
                            >Add to Cart</button>
                        </div>
                        <p>
                            Status:
                            <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                                {product.stock < 1 ? "Out of Stock" : "Available"}
                            </b>
                        </p>
                    </div>

                    <div className='details-block-4'>
                        Description: <p>{product.description}</p>
                    </div>
                    <button className='submitReview'>
                        Submit Review
                    </button>
                </div>
            </div>

            <h3 className='reviewsHeading'>Reviews</h3>

            {
                product.reviews?.length > 0 ? (
                    <div>
                        {product.reviews.map((review) => (
                            <ReviewCard key={review._id} review={review} />
                        ))}
                    </div>
                ) : (
                    <p className='reviews'>No reviews yet </p>
                )
            }
        </>
    )
}

export default ProductDetails