import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/productSlice';
import alertReducer from '../features/alertSlice';
import userReducer from '../features/User/userSlice';

export const store = configureStore({
    reducer: {
        product: productReducer,
        alert: alertReducer,
        user: userReducer,
    }
})