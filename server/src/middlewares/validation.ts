import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        errors: result.error.flatten().fieldErrors
      });
      return;
    }

    req.body = result.data;

    next();
  };