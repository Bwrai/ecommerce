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
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || "Login failed"
            );
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

// Load user
export const loadUser = createAsyncThunk(
    "user/loadUser",
    async (_, thunkAPI) => {
        try {
            const { data } = await axios.get("/api/me");
            return data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(null);
        }
    }
)

// Logout user
export const logout = createAsyncThunk(
    "user/logout",
    async (_, thunkAPI) => {
        try {
            await axios.get("/api/logout");
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

// Update profile
export const updateProfile = createAsyncThunk(
    "user/update",
    async (userData, thunkAPI) => {
        try {
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            const response = await axios.put("/api/me/update", userData, config);
            return response.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

// Forgot Password
export const updatePassword = createAsyncThunk(
    "user/updatePassword",
    async (password, thunkAPI) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } }
            const { data } = await axios.put(`/api/password/update`, password, config)
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message)
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
    isUpdated: false,

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
        },
        clearUpdateStatus: (state) => {
            state.isUpdated = false;
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
            //update profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isUpdated = false;
            })
            //Update Password
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = true;
                state.message = action.payload.message;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            //Load user
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })
            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearErrors, clearMessage, clearUpdateStatus } = userSlice.actions;
export default userSlice.reducer;