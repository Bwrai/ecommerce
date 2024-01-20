import mongoose, { mongo } from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description Required"],
    },
    price: {
        type: Number,
        required: [true, "Price cannot be left empty"],
        maxLength: [8, "Price cannot exceed 8 characters"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter the category"],
    },
    stock: {
        type: String,
        required: [true, "Please enter product stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
    },
    noOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            ratings: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Product = mongoose.model("Product", productSchema);
export default Product;