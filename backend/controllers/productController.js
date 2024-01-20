import Product from '../models/productModel.js';
import catchAsyncErrors from '../middleware/catchAsync.js';
import { errorHandler } from '../utils/errorHandler.js';
import ApiFeatures from '../utils/apifeatures.js';

// Create Products -Admin
export const createProduct = catchAsyncErrors(async (req, res, next) => {
    try {
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
    const resultPerPage = 5;
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
})