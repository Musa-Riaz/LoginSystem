import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import errorMiddleware from './app/middlewares/errorMiddleware';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }
})


//connection to db
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('MongoDB connected');
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

//Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

//connecting to the database before making connection to vercel
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Database connection error' });
        next(error);
    }

});

//routes
app.use('/', (req, res) => {
    res.send({
        message: "connected"
    })
})

//error middlware at the end
app.use(errorMiddleware);

export { app, server, io }
