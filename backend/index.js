import express from 'express';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
// Import Routes 
import product from './routes/productRoutes.js';
import middlewareError from './middleware/error.js';
import user from './routes/userRoute.js';
import order from './routes/orderRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import fileUpload from 'express-fileupload';



const app = express();
dotEnv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // React frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(fileUpload());


const PORT = process.env.PORT || 5000;
const dbUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce";


// DATABASE CONNECTION
async function mongoConnection() {
    await mongoose.connect(dbUrl);
    console.log("DATABASE_CONNECTED")
    // ERROR IS NOT CATCHED HERE- Since, we are handling unhandledPromise rejection.
    // try { 
    // } catch (err) {
    //     console.error("DATABASE_CONNECTION ERROR", err);
    // }
}
mongoConnection();

// Configure API endpoints for routes. 
app.use('/api', product);
app.use('/api', user);
app.use('/api', order);



// ERROR HANDLING MIDDLEWARE -----Sends response with error message.
app.use(middlewareError);

// Listen to the server
const server = app.listen(PORT, () => {
    console.log(`App is listening on Port: ${PORT}`)
})

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting Down the server due to unhandled Promise rejection");
    // Close the server to stop accepting new connections.
    server.close((closeError) => {
        if (closeError) {
            console.error("Error while clossing the server");
        } else {
            console.log("Server closed successfully");
        }
        process.exit(1);
    });
})