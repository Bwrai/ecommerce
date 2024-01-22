import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct } from "../controllers/productController.js"
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/products',  getAllProducts);
router.get('/products/:id', getProductDetails);
router.post('/products/new', isAuthenticatedUser, authorizeRoles("admin"), createProduct);
// using route for multiple routes
router.route("/products/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);


export default router;
// or we cound use: module.exports = router;