import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct } from "../controllers/productController.js"

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/products/:id', getProductDetails);
router.post('/products/new', createProduct);
// using route for multiple routes
router.route("/products/:id")
    .put(updateProduct)
    .delete(deleteProduct);





export default router;
// or we cound use: module.exports = router;