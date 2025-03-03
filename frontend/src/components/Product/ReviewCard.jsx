import React from 'react'
import Rating from "@mui/material/Rating"
import profilePng from '../../images/profile.png'
import "./ReviewCard.css"

const ReviewCard = ({ review }) => {
    const { name, rating, comment } = review;

    const ratingOptions = {
        value: rating,
        readOnly: true,
        precision: 0.5,
    }
    return (
        <div className='reviewList'>
            <div className='reviewCard'>
                <img src={profilePng} alt="User Profile" />
                <p>{name}</p>
                <Rating {...ratingOptions} />
                <span className='reviewCardComment'>{comment}</span>
            </div>
        </div>
    )
}

export default ReviewCard