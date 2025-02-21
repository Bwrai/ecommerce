import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/productSlice';
import alertReducer from '../features/alertSlice';

export const store = configureStore({
    reducer: {
        product: productReducer,
        alert: alertReducer,
    }
})