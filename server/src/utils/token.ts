import { config } from "../config/config";
import { Response } from "express";
import jwt from "jsonwebtoken";

const generateTokens = (res: Response, id: string, role: string) => {

  // Access token (short life)
  const accessToken = jwt.sign(
    { id, role },
    config.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  // Refresh token (long life)
  const refreshToken = jwt.sign(
    { id },
    config.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export default generateTokens;