import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import { } from './DB/firebase.js';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import adminRoutes from './routes/adminRoute.js';
import userRoutes from './routes/userRoute.js';
import sessionRoutes from './routes/sessionRoute.js';
import subscriptionRoute from './routes/subscriptionRoute.js';

//configure env
dotenv.config();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/session', sessionRoutes);
app.use('/api/v1/subscription', subscriptionRoute);

//rest api
app.get('/', (req, res) => {
  try {
    res.send('<h1>Welcome to MDN-Perfection</h1>');
  } catch (error) {
    console.log(error);
  }
});

//PORT
const PORT = process.env.PORT || 8080;

//Listens
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.cyan);
});
