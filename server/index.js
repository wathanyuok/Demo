// server/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import handleErrors from './middlewares/error.js';

// Import routes
import backofficeAuthRouter from './routes/backoffice/auth-route.js';
import backofficeCategoryRouter from './routes/backoffice/category-routes.js';
import backofficeProductRouter from './routes/backoffice/product-routes.js';
import orderRoutes from './routes/backoffice/order-routes.js';

// Client routes
import authRoutes from './routes/auth-route.js';
import categoryRoutes from './routes/category-route.js';
import productRoutes from './routes/product-route.js';
import cartRoutes from './routes/cart-route.js';
import orderRoutesClient from './routes/order-route.js';



const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());



// Client routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutesClient);




app.use("/api/backoffice/auth", backofficeAuthRouter);
app.use("/api/backoffice/categories", backofficeCategoryRouter);
app.use("/api/backoffice/products", backofficeProductRouter);
app.use('/api/backoffice/orders', orderRoutes);


// Handle errors
app.use(handleErrors);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))