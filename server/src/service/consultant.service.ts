import prisma from "../config/prisma.client";
import { QueryOptions } from "../utils/pagination";
import { IConsultant, IUpdateConsultant } from "../interface/IConsultant";
import { AppError } from "../utils/app-error";

class ConsultantService {

  async createConsultant(data: IConsultant) {

    const existingConsultant = await prisma.consultant.findFirst({
      where: {
        OR: [
          { email: data.email }
        ]
      }
    });

    if (existingConsultant) {
      throw new AppError("This consultant exists", 400);
    }

    return prisma.consultant.create({
      data
    });
  }

  async getConsultants(query: QueryOptions) {
  const { skip, limit, search, sortBy, order, expertise, status } = query;

  const where: any = {};

  if (!status || status === "active") {
    where.deletedAt = null;
  }

  if (status === "archived") {
    where.deletedAt = { not: null };
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  if (expertise) {
    where.expertise = {
      equals: expertise,
      mode: "insensitive",
    };
  }

  const queryOptions: any = {
    where,
    orderBy: sortBy
      ? { [sortBy]: order }
      : { createdAt: "desc" },
  };

  if (limit !== 0) {
    queryOptions.take = limit;
    queryOptions.skip = skip;
  }

  const [consultants, total] = await Promise.all([
    prisma.consultant.findMany(queryOptions),
    prisma.consultant.count({ where }),
  ]);

  return { consultants, total };
}

  async getConsultantById(id: string) {


    const consultant = await prisma.consultant.findUnique({
      where: { id },
      include: {
        slots: true
      }
    });

    if (!consultant) {
      throw new AppError("Consultant not found", 404);
    }

    return consultant;
  }

  async updateConsultant(id: string, data: IUpdateConsultant) {

    const { ...updateData } = data
    const consultant = await prisma.consultant.findUnique({
      where: { id }
    });

    if (!consultant) {
      throw new AppError("Consultant not found",404);
    }

    const updateConsultant = await prisma.consultant.update({
      where: { id },
      data: updateData
    });

    return updateConsultant

  }

  async softDeleteConsultant(id: string) {

    const consultant = await prisma.consultant.findUnique({
      where: { id }
    });

    if (!consultant) {
      throw new AppError("Consultant not found", 404)
    }

    const slots = await prisma.timeSlot.count({
      where: { consultantId: id }
    });

    if (slots > 0) {
      throw new AppError("Cannot delete consultant with existing time slots",400)
    }

    await prisma.consultant.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return {
      success: true,
      message: "Consultant archived"
    };
  }

  async restoreConsultant(id: string) {

    const consultant = await prisma.consultant.findUnique({ where: { id } });

    if (!consultant) {
        throw new AppError("Consultant not found", 404);
    }

    if (!consultant.deletedAt) {
        throw new AppError("Consultant is not archived", 400);
    }

    await prisma.consultant.update({
        where: { id },
        data: {
            deletedAt: null
        }
    });

    return {
      success: true,
      message: "Consultant restored successfully"
    };
}

async permanentDeleteConsultant(id: string) {

    const consultant = await prisma.consultant.findUnique({ where: { id } });

    if (!consultant) {
      throw new AppError("Consultant not found", 404);
    }

    await prisma.consultant.delete({
      where: { id }
    });

    return {
      success: true,
      message: "Consultant permanently deleted"
    };
}

}

export default new ConsultantService();

