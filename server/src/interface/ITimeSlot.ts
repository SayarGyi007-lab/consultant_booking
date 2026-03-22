import { SlotStatus } from "@prisma/client";

export interface ICreateTimeSlotInput {
  consultantId: string;
  startTime: string;
  endTime: string;
  status?: SlotStatus;
}

export interface IUpdateTimeSlotInput {
  startTime?: string;
  endTime?: string;
  status?: SlotStatus;
}