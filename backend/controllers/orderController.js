import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import catchAsyncErrors from "../middleware/catchAsync.js";
import { errorHandler } from "../utils/errorHandler.js";

// Create new Order
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    })
});

// Get Single Order
export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if (!order) {
        return next(errorHandler(404, "Order not found with this Id"));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// Get Logged in users Order
export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    });
});

//Get All Orders--Admin
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

// Update Order Status -Admin
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(errorHandler(404, "Order not found with this Id!"));
    }

    if (order.orderStatus === "Delivered") {
        return next(errorHandler(400, "Your order has already been delivered"));
    }

    // if (req.body.status === "shipped") {
    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);
    })
    // }
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    })
});
// Function to update Stock 
async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

// Delete Order -Admin
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(errorHandler(404, "The requested order does not exist with this Id!"))
    }
    await Order.findByIdAndDelete(order);
    res.status(200).json({
        success: true,
        message: "Order Successfully Deleted!"
    })
})