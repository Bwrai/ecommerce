import express from 'express';
import {
    createProduct,
    createProductReview,
    deleteProduct,
    deleteReview,
    getAllProducts,
    getProductDetails,
    getProductReviews,
    updateProduct
} from "../controllers/productController.js"
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/products/:id', getProductDetails);
//Admin routes
router.post('/admin/products/new', isAuthenticatedUser, authorizeRoles("admin"), createProduct);
// using route for multiple routes
router.route("/products/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
    
router.put("/review", isAuthenticatedUser, createProductReview);
router.route("/reviews")
    .get(getProductReviews)
    .delete(isAuthenticatedUser, deleteReview);



export default router;
// or we cound use: module.exports = router;