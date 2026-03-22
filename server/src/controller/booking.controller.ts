import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import bookingService from "../service/booking.service";
import { buildQuery } from "../utils/pagination";
import { AuthRequest } from "../middlewares/authentication";


export const createBooking = asyncHandler( async (req: AuthRequest
  , res: Response) => {

    const booking = await bookingService.createBooking({...req.body, userId: req.user!.id});

    res.status(201).json({
      message: "Booking created successfully",
      data: booking
    });
  }
);


export const getMyBookings = asyncHandler( async (req: AuthRequest, res: Response) => {

    const query = buildQuery(req);

    const bookings = await bookingService.getBookings(query, req.user!.id);

    res.json({success: true, ...bookings});
  }
);

export const getAllBookings = asyncHandler( async (req: AuthRequest, res: Response) => {

    const query = buildQuery(req);

    const bookings = await bookingService.getBookings(query);

    res.json({success: true, ...bookings});
  }
);


// export const getBookingById = asyncHandler( async (req: AuthRequest, res: Response) => {

//     const { id } = req.params as {id:string};

//     const booking = await bookingService.getBookingById(id,req.user!.id);

//     res.json({ success: true,
//       data: booking
//     });
//   }
// );


export const deleteBooking = asyncHandler( async (req: Request, res: Response) => {

    const { id } = req.params as {id: string};

    const result = await bookingService.deleteBooking(id);

    res.json(result);
  }
);