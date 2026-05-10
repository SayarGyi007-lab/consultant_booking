export interface ICreateTimeSlotInput {
  consultantId: string;
  startTime: string;
  // endTime: string;
  status?: "AVAILABLE" | "BOOKED" | "EXPIRED";
}

export interface IUpdateTimeSlotInput {
  startTime?: string;
  // endTime?: string;
  status?: "AVAILABLE" | "BOOKED" | "EXPIRED";
}