import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
// import { authRoutes, userRoutes } from './routes';
import { errorMiddleware } from './middleware';

dotenv.config();

const app = express();

app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
//make route in one call, instead of calling every module router separately

app.use('/api', routes);
app.use('/uploadss', express.static('uploads')); //to make it publicly accessbile,
//remaining folders will be private, until we publicly expose it.
//since it is an index file, so it will be automatically read and
// when we import from routes, it will automatically read this file and get the routes from here.
// in app.ts

app.use(errorMiddleware);

export default app;
