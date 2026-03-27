import { ICreateBookingInput } from "../interface/IBooking";
import prisma from "../config/prisma.client";
import { QueryOptions } from "../utils/pagination";
import { AppError } from "../utils/app-error";
import { bumpVersion, getVersion } from "../utils/cache-version";
import { getCache, setCache } from "../utils/cache";

class BookingService {

  async createBooking(data: ICreateBookingInput) {

  const newBooking = await prisma.$transaction(async (tx: any) => {

    const slot = await tx.timeSlot.findUnique({
      where: { id: data.slotId }
    });

    if (!slot) {
      throw new AppError("Time slot not found", 404);
    }

    const now = new Date();
    if (slot.startTime < now) {
      throw new AppError("Cannot book past time slots", 400);
    }
    if (slot.startTime >= slot.endTime) {
      throw new AppError("Invalid slot time range",400);
    }

    const updatedSlot = await tx.timeSlot.updateMany({
      where: {
        id: data.slotId,
        status: "AVAILABLE"
      },
      data: {
        status: "BOOKED"
      }
    });

    if (updatedSlot.count === 0) {
      throw new AppError("Slot already booked", 400);
    }

    return await tx.booking.create({
      data: {
        slotId: data.slotId,
        userId: data.userId,
        customerName: data.customerName,
        customerEmail: data.customerEmail
      },
      include: {
        slot: true,
        user: true
      }
    });
  });

  await bumpVersion("bookings:version");
  await bumpVersion("available-slot:version");

  return newBooking;
}


  async getBookings(query: QueryOptions, userId?: string) {

    const version = await getVersion("bookings:version")
    const cacheKey = `bookings:v${version}:${userId || 'admin'}:${JSON.stringify(query)}`

    const cached = await getCache(cacheKey)
    if (cached) {
    console.log("cache hit booking");
    return cached;
  }

  console.log("cache miss booking");

    const { search, skip, limit, order, sortBy, page } = query;

    const where = {
      ...(userId ? { userId } : {})
    } as any;

    if (search) {
      where.OR = [
        {
          customerName: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          slot: {
            consultant: {
              OR: [
                {
                  firstName: {
                    contains: search,
                    mode: "insensitive"
                  }
                }
                // can add search later 
              ]
            }
          }
        }
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order
      },
      include: {
        user: true,
        slot: {
          include: {
            consultant: true
          }
        }
      }
    });

    const total = await prisma.booking.count({ where });

    const result = {
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
    await setCache(cacheKey, result, 60);

    return result
  }


  // async getBookingById(id: string, userId: string) {

  //   const booking = await prisma.booking.findFirst({
  //     where: { id, userId: userId },
  //     include: {
  //       slot: true,
  //       user: true
  //     }
  //   });

  //   if (!booking) {
  //     throw new Error("Booking not found");
  //   }

  //   return booking;
  // }


  async deleteBooking(id: string) {

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    await prisma.$transaction(async (tx: any) => {

      await tx.booking.delete({
        where: { id }
      });

      await tx.timeSlot.update({
        where: { id: booking.slotId },
        data: {
          status: "AVAILABLE"
        }
      });

    });

    await bumpVersion("available-slot:version");
    await bumpVersion("bookings:version");
    return { message: "Booking cancelled successfully" };
  }
}

export default new BookingService();