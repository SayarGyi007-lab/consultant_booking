import { ICreateTimeSlotInput, IUpdateTimeSlotInput } from "../interface/ITimeSlot";
import prisma from "../config/prisma.client";
import { QueryOptions } from "../utils/pagination";
import { AppError } from "../utils/app-error";


export class TimeSlotService {

  async createTimeSlot(data: ICreateTimeSlotInput) {

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

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

    return slot;
  }


  async getAllTimeSlots(query: QueryOptions) {
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

  return {
    data: slots,
    pagination: {
      page: query.page,
      limit,
      total,
      totalPages: limit === 0 ? 1 : Math.ceil(total / limit)
    }
  };
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

    const slots = await prisma.timeSlot.findMany({
      where: {
        consultantId,
        status: "AVAILABLE"
      },
      orderBy: {
        startTime: "asc"
      }
    });

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

  return { message: "TimeSlot deleted successfully" };
}

}

export default new TimeSlotService()