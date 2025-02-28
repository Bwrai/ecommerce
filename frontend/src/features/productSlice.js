import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from 'axios';

//Fetch All products
export const getProducts = createAsyncThunk(
    "products/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/products");
            return data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong!"
            );
        }
    }

)
//Fetch Product details
export const getProductDetails = createAsyncThunk(
    "products/details",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/products/${id}`)
            return data;
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went Wrong!"
            );
        }
    }
)


const initialState = {
    products: [],
    product: {},
    loading: false,
    error: null,
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Products
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.productsCount = action.payload.productsCount;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.products = [];
            })
            // Get Product Details
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.product;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearErrors } = productSlice.actions;
export default productSlice.reducer;