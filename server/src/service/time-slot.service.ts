import { ICreateTimeSlotInput, IUpdateTimeSlotInput } from "../interface/ITimeSlot";
import prisma from "../config/prisma.client";
import { QueryOptions } from "../utils/pagination";
import { AppError } from "../utils/app-error";
import { bumpVersion, getVersion } from "../utils/cache-version";
import { getCache, setCache } from "../utils/cache";


export class TimeSlotService {

  async createTimeSlot(data: ICreateTimeSlotInput) {

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const now = new Date();

    if (start<= now) {
    throw new AppError("Cannot create a time slot in the past", 400);
}


    if (start >= end) {
      throw new AppError("End time must be after start time", 400);
    }

    // Check for overlapping slots
    const conflict = await prisma.timeSlot.findFirst({
      where: {
        consultantId: data.consultantId,
        startTime: { lt: end },
        endTime: { gt: start }
      }
    });

    if (conflict) {
      throw new AppError("Time slot overlaps with an existing slot", 400);
    }

    const slot = await prisma.timeSlot.create({
      data: {
        consultantId: data.consultantId,
        startTime: start,
        endTime: end,
        status: data.status || "AVAILABLE"
      }
    });

    await bumpVersion("time-slots:version")
    await bumpVersion("available-slot:version")

    return slot;
  }


  async getAllTimeSlots(query: QueryOptions) {

    const version = await getVersion("time-slots:version")
    const cacheKey = `time-slots:v${version}:${JSON.stringify(query)}`
    const cached = await getCache(cacheKey)

    if (cached) {
      console.log("cache hit time slot");
      return cached;
    }

    console.log("cache miss time slot");


    const { skip, limit, search, sortBy, order, expertise } = query;

    const where = {} as any;
    const consultantFilter = {} as any;

    if (search) {
      consultantFilter.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } }
      ];
    }

    if (expertise) {
      consultantFilter.expertise = {
        equals: expertise,
        mode: "insensitive"
      };
    }

    if (Object.keys(consultantFilter).length > 0) {
      where.consultant = {
        is: consultantFilter
      };
    }

    // build query safely
    const findOptions: any = {
      where,
      orderBy: { [sortBy]: order },
      include: {
        consultant: true,
        booking: true
      }
    };

    if (limit !== 0) {
      findOptions.skip = skip;
      findOptions.take = limit;
    }

    const [slots, total] = await Promise.all([
      prisma.timeSlot.findMany(findOptions),
      prisma.timeSlot.count({ where })
    ]);

    const result = {
      data: slots,
      pagination: {
        page: query.page,
        limit,
        total,
        totalPages: limit === 0 ? 1 : Math.ceil(total / limit)
      }
    };

    await setCache(cacheKey, result, 60);

    return result;
  }


  // async getTimeSlotById(id: string) {

  //   const slot = await prisma.timeSlot.findUnique({
  //     where: { id },
  //     include: {
  //       consultant: true,
  //       booking: true
  //     }
  //   });

  //   if (!slot) {
  //     throw new Error("TimeSlot not found");
  //   }

  //   return slot;
  // }


  //Get slots by consultant
  // async getSlotsByConsultant(consultantId: string) {

  //   const slots = await prisma.timeSlot.findMany({
  //     where: {
  //       consultantId
  //     },
  //     orderBy: {
  //       startTime: "asc"
  //     },
  //     include: {
  //       booking: true
  //     }
  //   });

  //   return slots;
  // }


  //Get only available slots
  async getAvailableSlotsByConsultant(consultantId: string) {

    const version = await getVersion("available-slot:version")
    const cacheKey = `available-slot:v${version}:${consultantId}`
    const cached = await getCache(cacheKey)

    if (cached) {
      console.log("cache hit available slot");
      return cached;
    }

    console.log("cache miss available slot");

    const slots = await prisma.timeSlot.findMany({
      where: {
        consultantId,
        status: "AVAILABLE"
      },
      orderBy: {
        startTime: "asc"
      }
    });

    await setCache(cacheKey,slots,60)

    return slots;
  }


  async updateTimeSlot(id: string, data: IUpdateTimeSlotInput) {

    const slot = await prisma.timeSlot.update({
      where: { id },
      data: {
        ...(data.startTime && { startTime: new Date(data.startTime) }),
        ...(data.endTime && { endTime: new Date(data.endTime) }),
        ...(data.status && { status: data.status })
      }
    });

    await bumpVersion("time-slots:version")
    await bumpVersion("available-slot:version")

    return slot;
  }


  async deleteTimeSlot(id: string) {

    const slot = await prisma.timeSlot.findUnique({
      where: { id }
    });

    if (!slot) {
      throw new AppError("TimeSlot not found", 404);
    }

    if (slot.status === "BOOKED") {
      throw new AppError("Cannot delete a booked time slot", 400);
    }

    await prisma.timeSlot.delete({
      where: { id }
    });

    await bumpVersion("time-slots:version")
    await bumpVersion("available-slot:version")
    return { message: "TimeSlot deleted successfully" };
  }

}

export default new TimeSlotService()