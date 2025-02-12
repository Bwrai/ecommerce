import Product from '../models/productModel.js';
import catchAsyncErrors from '../middleware/catchAsync.js';
import { errorHandler } from '../utils/errorHandler.js';
import ApiFeatures from '../utils/apifeatures.js';

// Create Products -Admin
export const createProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const product = await Product.create(req.body);
        return res.status(201).json({
            success: true,
            product
        })
    } catch (error) {
        next(error);
    }
})

// Get All Products -Admin
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    try {
        const apifeature = new ApiFeatures(Product.find(), req.query)
            .search()
            .filter()
            .pagination(resultPerPage);
        const products = await apifeature.query;
        return res.status(200).send({
            success: true,
            products,
            productCount,
        })
    } catch (error) {
        next(error)
    }
})

// Get Product details
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(errorHandler(404, "Product not found"))
    }
    res.status(200).json({
        success: true,
        product
    })
})

// Update Product -Admin
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(errorHandler(404, "Product not found!"));
    }

    try {
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        next(error)
    }
})

// Delete Product

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(errorHandler(404, "Product not found!"))
    }
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product successfully deleted!"
        })
    } catch (error) {
        next(error)
    }
});

//Create new review or update the review
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,     // Current user's ID
        name: req.user.name,    // Current user's name
        rating: Number(rating), // Convert rating to a number
        comment,
    };

    const product = await Product.findById(productId);
    // Check if the current user has already reviewed the product
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    // If the user has already reviewed the product, update the existing review
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                // Update the rating and comment of the existing review
                rev.rating = rating;
                rev.comment = comment;
            }
        })
    } else {
        // If the user hasn't reviewed the product yet, add a new review
        product.reviews.push(review); // Add the new review to the reviews array
        product.noOfReviews = product.reviews.length;   // Update the number of reviews
    }
    // Calculate the average rating for the product
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    })
    product.ratings = avg / product.reviews.length;
    await product.save({ validateBeforeSave: false });

    // Send a success response
    res.status(200).json({
        success: true,
    })
})

// Get all reviews of a product
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(errorHandler(404, "Product not found!"))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})

// Delete review
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(errorHandler(404, "Product not found!"))
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() != req.query.id.toString()
    );
    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    const ratings = avg / reviews.length;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    })
})