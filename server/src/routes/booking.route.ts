// import express from "express";
// import { validate } from "../middlewares/validation";
// import { createBookingSchema } from "../validation/booking";
// import { createBooking, deleteBooking, getAllBookings, getMyBookings } from "../controller/booking.controller";
// import { protect } from "../middlewares/authentication";
// import { adminOnly} from "../middlewares/authorization";

// const router = express.Router();

// router.post("/", protect, validate(createBookingSchema),  createBooking);
// router.get("/my-bookings", protect, getMyBookings);
// router.get("/", protect, adminOnly, getAllBookings);
// router.delete("/:id", protect, adminOnly, deleteBooking);

// export default router;

import express from "express";
import { validate } from "../middlewares/validation";
import { createBookingSchema } from "../validation/booking";
import {
  createBooking,
  cancelBooking,
  completeBooking,
  getAllBookings,
  getMyBookings
} from "../controller/booking.controller";
import { protect } from "../middlewares/authentication";
import { adminOnly } from "../middlewares/authorization";

const router = express.Router();

router.post("/", protect, validate(createBookingSchema), createBooking);

router.get("/my-bookings", protect, getMyBookings);
router.get("/", protect, adminOnly, getAllBookings);

router.patch("/:id/cancel", protect, cancelBooking);
router.patch("/:id/complete", protect, adminOnly, completeBooking);

export default router;