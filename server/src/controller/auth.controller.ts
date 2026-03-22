import { Request, Response } from "express";
import AuthService from "../service/auth.service";
import { asyncHandler } from "../utils/async-handler";

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {

  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data: user
  });

})


export const login = asyncHandler(async (req: Request, res: Response) => {

  const { email, password } = req.body;

  const user = await authService.login(email, password, res);

  res.json({
    success: true,
    data: user
  });

})


export const logout = asyncHandler(async (_req: Request, res: Response) => {

  const result = await authService.logout(res);

  res.json(result);

});