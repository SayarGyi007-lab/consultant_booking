import prisma from "../config/prisma.client";
import { ICreateBookingInput } from "../interface/IBooking";
import { QueryOptions } from "../utils/pagination";
import { AppError } from "../utils/app-error";
import { bumpVersion, getVersion } from "../utils/cache-version";
import { getCache, setCache } from "../utils/cache";

class BookingService {

  async createBooking(data: ICreateBookingInput) {
  const booking = await prisma.$transaction(async (tx: any) => {

    const slot = await tx.timeSlot.findUnique({
      where: { id: data.slotId }
    });

    if (!slot) throw new AppError("Time slot not found", 404);

    const now = new Date();

    if (slot.startTime < now) {
      throw new AppError("Cannot book past time slots", 400);
    }

    const existing = await tx.booking.findFirst({
  where: { slotId: data.slotId }
});

    if (existing && existing.status !== "CANCELLED") {
      throw new AppError("Slot already booked", 400);
    }

    const updated = await tx.timeSlot.updateMany({
      where: {
        id: data.slotId,
        status: "AVAILABLE"
      },
      data: { status: "BOOKED" }
    });

    if (updated.count === 0) {
      throw new AppError("Slot already booked", 400);
    }

    if (existing) {
  return await tx.booking.update({
    where: { id: existing.id },
    data: {
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      status: "CONFIRMED"
    },
    include: {
      slot: true,
      user: true
    }
  });
}

    return await tx.booking.create({
      data: {
        slotId: data.slotId,
        userId: data.userId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        status: "CONFIRMED"
      },
      include: {
        slot: true,
        user: true
      }
    });
  });

  await bumpVersion("bookings:version");
  await bumpVersion("available-slot:version");
  await bumpVersion("time-slots:version");
  await bumpVersion("consultants:version");
  await bumpVersion("consultant:version");

  return booking;
}

  async getBookings(query: QueryOptions, userId?: string) {

    const version = await getVersion("bookings:version");
    const cacheKey = `bookings:v${version}:${userId || "admin"}:${JSON.stringify(query)}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const { search, skip, limit, order, sortBy, page, status } = query;

    const where: any = {
      ...(userId ? { userId } : {})
    };

    if (!status || status === 'CONFIRMED') {
      where.status = 'CONFIRMED'
    }
    if (status === 'CANCELLED') {
      where.status = 'CANCELLED'
    }
    if (status === 'COMPLETED') {
      where.status = 'COMPLETED'
    }

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
              firstName: {
                contains: search,
                mode: "insensitive"
              }
            }
          }
        }
      ];
    }

    // const queryOptions: any = {
    //   where,
    //   orderBy: { [sortBy]: order },
    //   include: {
    //     user: true,
    //     slot: {
    //       include: {
    //         consultant: true
    //       }
    //     },
    //     review: true
    //   }
    // };

    const queryOptions: any = {
      where,
      orderBy: {
        slot: {
          startTime: "asc"
        }
      },
      include: {
        user: true,
        slot: {
          include: {
            consultant: true
          }
        },
        review: true
      }
    };

    if (limit !== 0) {
      queryOptions.take = limit;
      queryOptions.skip = skip;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany(queryOptions),
      prisma.booking.count({ where })
    ]);

    const result = {
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: limit === 0 ? 1 : Math.ceil(total / limit)
      }
    };

    await setCache(cacheKey, result, 60);

    return result;
  }

  async cancelBooking(id: string) {
  const result = await prisma.$transaction(async (tx: any) => {

    const booking = await tx.booking.findUnique({
      where: { id }
    });

    if (!booking) throw new AppError("Booking not found", 404);

    if (booking.status === "CANCELLED") {
      throw new AppError("Booking already cancelled", 400);
    }

    if (booking.status === "COMPLETED") {
      throw new AppError("Completed booking cannot be cancelled", 400);
    }

    const updatedBooking = await tx.booking.update({
      where: { id },
      data: { status: "CANCELLED" }
    });

    await tx.timeSlot.update({
      where: { id: booking.slotId },
      data: { status: "AVAILABLE" }
    });

    return updatedBooking;
  });

  await bumpVersion("bookings:version");
  await bumpVersion("available-slot:version");
  await bumpVersion("time-slots:version");
  await bumpVersion("consultants:version");
  await bumpVersion("consultant:version");

  return result;
}

  async completeBooking(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) throw new AppError("Booking not found", 404);

    if (booking.status !== "CONFIRMED") {
      throw new AppError("Only confirmed bookings can be completed", 400);
    }

    await bumpVersion("bookings:version");

    return await prisma.booking.update({
      where: { id },
      data: { status: "COMPLETED" }
    });
  }

  async autoCompleteBookings() {
  const now = new Date();

  const result = await prisma.booking.updateMany({
    where: {
      status: "CONFIRMED",
      slot: {
        endTime: { lte: now }
      }
    },
    data: { status: "COMPLETED" }
  });

  if (result.count > 0) {
    await bumpVersion("bookings:version");
  }

  return result.count;
}
}

export default new BookingService();