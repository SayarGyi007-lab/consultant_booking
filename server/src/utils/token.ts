import { config } from "../config/config";
import jwt from "jsonwebtoken";

const generateTokens = (id: string, role: string) => {
  const accessToken = jwt.sign(
    { id, role },
    config.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id, role },
    config.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  // Return tokens in response body — let frontend handle storage
  return { accessToken, refreshToken };
};

export default generateTokens;