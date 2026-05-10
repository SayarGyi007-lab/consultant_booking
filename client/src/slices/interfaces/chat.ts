export interface ConsultantWithSlots {
  consultantId: string
  consultantName: string
  expertise: string
  experience: number
  rating: number
  availableSlots: {
    slotId: string
    startTime: string
    endTime: string
  }[]
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt?: string;
}

export interface ChatResponse {
  sessionId: string;
  // userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  consultantCards: ConsultantWithSlots[];
}

export interface SendMessageInputs {
  sessionId?: string;
  content: string;
}