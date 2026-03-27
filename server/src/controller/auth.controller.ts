import { Request, Response } from "express";
import AuthService from "../service/auth.service";
import { asyncHandler } from "../utils/async-handler";
import { AppError } from "utils/app-error";

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

  const result = await authService.login(email, password);

  res.json({
    success: true,
    data: result
  });
});


export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No access token provided");
  }

  const accessToken = authHeader.split(" ")[1]!;
  const refreshToken = req.headers["x-refresh-token"] as string;

  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const result = await authService.logout(accessToken, refreshToken);

  res.json({
    success: true,
    message: "Logout successfully"
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.headers["x-refresh-token"] as string;

  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401);
  }

  const tokens = await authService.refresh(refreshToken);

  res.json({
    success: true,
    data: tokens
  });
});