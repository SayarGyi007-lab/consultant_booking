import { buildQuery } from "../utils/pagination";
import consultantService from "../service/consultant.service";
import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";


export const createConsultant = asyncHandler(async (req: Request, res: Response) => {

  const consultant = await consultantService.createConsultant(req.body);

  res.status(201).json({
    success: true,
    data: consultant
  });

});

export const getConsultants = asyncHandler(async (req: Request, res: Response) => {

  const query = buildQuery(req);

  const { consultants, total } = await consultantService.getConsultants(query);

  res.json({
    success: true,
    data: consultants,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit)
    }
  });

});

export const getConsultantById = asyncHandler(async (req: Request, res: Response) => {

  const { id } = req.params as {id: string};

  const consultant = await consultantService.getConsultantById(id);

  res.json({
    success: true,
    data: consultant
  });

});

export const updateConsultant = asyncHandler(async (req: Request, res: Response) => {

  const { id } = req.params as {id: string};

  const consultant = await consultantService.updateConsultant(id, req.body);

  res.json({
    success: true,
    data: consultant
  });

});

export const softDeleteConsultant = asyncHandler(async (req: Request, res: Response) => {

  const { id } = req.params as { id: string };

  const result = await consultantService.softDeleteConsultant(id);

  res.json({
    data: result
  });

});

export const restoreConsultant = asyncHandler(async (req: Request, res: Response) => {

  const { id } = req.params as { id: string };

  const result = await consultantService.restoreConsultant(id)

  res.status(200).json(result);


});

export const permanentDeleteConsultant = asyncHandler(async (req: Request, res: Response) => {

  const { id } = req.params as { id: string };

  const result = await consultantService.permanentDeleteConsultant(id)

  res.status(200).json(result);


});