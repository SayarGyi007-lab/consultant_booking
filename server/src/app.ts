import express from "express"
import cors from "cors"
import { config } from "./config/config"
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import consultantRoutes from './routes/consultant.route'
import timeSlotRoutes from './routes/time-slot.route'
import bookingRoutes from './routes/booking.route'
import errorHandler from './middlewares/error-handler'
import { globalLimiter } from "./middlewares/rate-limit";

const app = express()

const whitelist = [
    'http://localhost:5173',
    'http://localhost:5174',
    config.CLIENT_URL
  ].filter(Boolean);
  

const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (!origin) return callback(null, true); 
        if (whitelist.includes(origin)) {
            callback(null, true); 
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    exposedHeaders: ["x-access-token", "x-refresh-token"],
};

app.use(cors(corsOptions))

export const BaseUrl = '/api/v1'

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use(`${BaseUrl}`, globalLimiter)


app.use(`${BaseUrl}/auth`, authRoutes);
app.use(`${BaseUrl}/users`, userRoutes);
app.use(`${BaseUrl}/consultants`, consultantRoutes)
app.use(`${BaseUrl}/time-slots`,timeSlotRoutes)
app.use(`${BaseUrl}/bookings`, bookingRoutes)

app.use(errorHandler)

const PORT = config.PORT ||  4000;

app.listen(PORT,() => {
  console.log("Server is running on PORT", PORT);
});

