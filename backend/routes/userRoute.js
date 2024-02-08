import express from 'express';
import {
    deleteUser,
    forgotPassword,
    getAllUsers,
    getSingleUser,
    getUserDetails,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    updatePassword,
    updateUserProfile,
    updateUserRole
} from '../controllers/userController.js';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/me', isAuthenticatedUser, getUserDetails);
router.put('/password/update', isAuthenticatedUser, updatePassword);
router.put('/me/update', isAuthenticatedUser, updateUserProfile);
router.get('/admin/users', isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;