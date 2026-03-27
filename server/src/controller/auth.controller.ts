import { Request, Response } from "express";
import AuthService from "../service/auth.service";
import { asyncHandler } from "../utils/async-handler";
import { AppError } from "../utils/app-error";
import { AuthRequest } from "../middlewares/authentication";

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

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new AppError("Google token missing", 400);
  }

  const result = await authService.googleLogin(idToken);

  res.json({
    success: true,
    data: result
  });
});

export const updatePhone = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const { phone } = req.body;

    if (!phone) {
      throw new AppError("Phone is required", 400);
    }

    const user = await authService.updatePhone(userId, phone);

    res.json({
      success: true,
      message: "Phone updated successfully",
      data: {
        id: user.id,
        phone: user.phone,
      },
    });
  }
);


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