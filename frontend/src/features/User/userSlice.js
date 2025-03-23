import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Login 
export const login = createAsyncThunk(
    "user/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } }
            const { data } = await axios.post('/api/login', { email, password }, config)
            return data.user
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)
// Register
export const register = createAsyncThunk(
    "user/register",
    async (userData, thunkAPI) => {
        try {
            const config = { headers: { "Content-Type": "multipart/form-data" } }
            const response = await axios.post('/api/register', userData, config);
            return response.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || "Registration failed"
            )
        }
    }
)

const initialState = {
    user: null,
    users: [],
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null,
    success: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
    }
})

export const { clearErrors, clearMessage } = userSlice.actions;
export default userSlice.reducer;