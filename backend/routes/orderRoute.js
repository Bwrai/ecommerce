import express from 'express';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth.js';
import { deleteOrder, getAllOrders, getSingleOrder, myOrders, newOrder, updateOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/order/new', isAuthenticatedUser, newOrder);
router.get("/order/:id", isAuthenticatedUser, getSingleOrder);
router.get("/orders/me", isAuthenticatedUser, myOrders);
router.get("/admin/orders", isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router.route("/admin/order/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

    
export default router;