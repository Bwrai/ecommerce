import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct } from "../controllers/productController.js"
import { isAuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/products/:id', getProductDetails);
router.post('/products/new', isAuthenticatedUser, createProduct);
// using route for multiple routes
router.route("/products/:id")
    .put(isAuthenticatedUser, updateProduct)
    .delete(isAuthenticatedUser, deleteProduct);





export default router;
// or we cound use: module.exports = router;