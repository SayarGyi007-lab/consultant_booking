// src/controllers/chat.controller.ts
import {  Response, NextFunction } from "express";
import { handleChat } from "../service/chat.service";
import { AuthRequest } from "../middlewares/authentication";
import { sendMessageSchema } from "../validation/chat-message";


export const sendMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId, content } = sendMessageSchema.parse(req.body);

    const result = await handleChat({
      ...(sessionId && { sessionId }),
      userId: req.user!.id, 
      content,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};