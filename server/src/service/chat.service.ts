import { ICreateChatMessage } from "../interface/IChatMessage";
import prisma from "../config/prisma.client";
import { generateAIResponse } from "./ai.service";


const SYSTEM_PROMPT = `
You are a warm, friendly assistant for a consultant booking platform.
 
RULES OF ENGAGEMENT — follow these strictly:
 
1. GREETINGS: If the user just says hi/hello/hola/hey/sup with no other context, greet them back warmly and ask one open question: "What are you looking for help with today?" Nothing else. Do not mention consultants.
 
2. VAGUE REQUESTS: If the user's goal is unclear, ask ONE clarifying question. Do not list consultants yet.
 
3. SPECIFIC REQUESTS: Once you understand the user's goal, recommend 1–3 consultants from the data below that best match. Explain briefly why each one fits. Be conversational, not robotic.
 
4. NEVER: Lead with counts ("We have 5 consultants..."), list everyone unprompted, or repeat the same consultants regardless of what the user asked.
 
5. BOOKING + SLOTS:
   - ONLY mention a slot if that consultant's availableSlots array is non-empty.
   - NEVER say a consultant is available if their availableSlots array is [].
   - NEVER infer or guess slot availability — only use what is in the data.
   - If no matching consultant has slots, say so honestly and suggest the user check back later.
   - Never format or invent times. Only show available slots if trully exist.
   - Never mention a random consultant. Only mention consultants that are in the database.
 
6. TOPIC CHANGE: If the user's latest message introduces a clearly new topic, treat it as a fresh request. Do not redirect them back to the old topic.
 
7. OUT OF SCOPE: If the user asks something unrelated (weather, politics), politely say you can only help with consultant bookings.
 
RESPONSE FORMAT — CRITICAL:
You MUST always respond with a valid JSON object and nothing else. No markdown, no backticks, no explanation outside the JSON.
 
Schema:
{
  "message": "<your conversational reply here>",
  "consultantIds": ["<id1>", "<id2>"] // IDs of consultants you are recommending. Empty array [] if none.
}
 
Examples:
- Greeting only: { "message": "Hey! What are you looking for help with today?", "consultantIds": [] }
- Recommending: { "message": "I think Sarah and John would be great for you because...", "consultantIds": ["abc123", "def456"] }
 
CONSULTANT DATA — single source of truth:
{{CONSULTANT_DATA}}
`;

export interface ConsultantCard {
  consultantId: string;
  consultantName: string;
  expertise: string;
  experience: number;
  rating: number;
  availableSlots: { slotId: string; startTime: Date; endTime: Date }[];
}

export interface ChatResult {
  sessionId: string;
  assistantMessage: {
    id: string;
    content: string;
    role: string;
    createdAt: Date;
  };
  consultantCards: ConsultantCard[];
}

// 🔥 SAFE PARSER (KEY FIX)
function safeParseAI(text: string) {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export const handleChat = async (
  data: ICreateChatMessage
): Promise<ChatResult> => {
  let session;

  // 1. SESSION
  if (data.sessionId) {
    session = await prisma.chatSession.findUnique({
      where: { id: data.sessionId },
    });

    if (!session || session.userId !== data.userId) {
      throw new Error("Unauthorized session");
    }
  } else {
    session = await prisma.chatSession.create({
      data: { userId: data.userId },
    });
  }

  // 2. SAVE USER MESSAGE
  await prisma.chatMessage.create({
    data: {
      sessionId: session.id,
      userId: data.userId,
      role: "USER",
      content: data.content,
    },
  });

  // 3. LOAD DATA
  const [history, consultants, slots] = await Promise.all([
    prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    }),

    prisma.consultant.findMany({
      orderBy: { rating: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        expertise: true,
        experience: true,
        rating: true,
      },
    }),

    prisma.timeSlot.findMany({
      where: { status: "AVAILABLE" },
      select: {
        id: true,
        consultantId: true,
        startTime: true,
        endTime: true,
      },
    }),
  ]);

  // 4. SLOT MAP
  const slotMap = new Map<
    string,
    { slotId: string; startTime: Date; endTime: Date }[]
  >();

  for (const s of slots) {
    if (!slotMap.has(s.consultantId)) {
      slotMap.set(s.consultantId, []);
    }

    slotMap.get(s.consultantId)!.push({
      slotId: s.id,
      startTime: s.startTime,
      endTime: s.endTime,
    });
  }

  // 5. AI INPUT DATA
  const consultantsForAI = consultants.map((c) => ({
    consultantId: c.id,
    consultantName: `${c.firstName} ${c.lastName}`,
    expertise: c.expertise,
    experience: c.experience,
    rating: c.rating ?? 0,
    availableSlots: (slotMap.get(c.id) || [])
      .slice(0, 3)
      .map((s) => ({
        slotId: s.slotId,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
  }));

  console.log("AI input data:", JSON.stringify(consultantsForAI, null, 2));

  const systemPrompt = SYSTEM_PROMPT.replace(
    "{{CONSULTANT_DATA}}",
    JSON.stringify(consultantsForAI)
  );

  const aiMessages = [
    { role: "system", content: systemPrompt },
    ...history.map((m: any) => ({
      role: m.role === "USER" ? "user" : "assistant",
      content: m.content,
    })),
  ];

  // 6. AI RESPONSE (SAFE)
  let parsedAI: { message: string; consultantIds: string[] } = {
    message: "I'm having trouble responding right now.",
    consultantIds: [],
  };

  try {
    const raw = await generateAIResponse(aiMessages as any);

    const parsed = safeParseAI(raw);

    if (!parsed) {
      parsedAI = {
        message: raw,
        consultantIds: [],
      };
    } else {
      parsedAI = {
        message:
          typeof parsed.message === "string" ? parsed.message : raw,
        consultantIds: Array.isArray(parsed.consultantIds)
          ? parsed.consultantIds
          : [],
      };
    }
  } catch (err) {
    console.error("AI ERROR:", err);
  }

  // 7. SAVE ASSISTANT MESSAGE
  const assistantMessage = await prisma.chatMessage.create({
    data: {
      sessionId: session.id,
      role: "ASSISTANT",
      content: parsedAI.message,
    },
  });

  // 8. BUILD CONSULTANT CARDS
  const recommendedSet = new Set(parsedAI.consultantIds);

  const consultantCards: ConsultantCard[] = consultants
    .filter((c) => recommendedSet.has(c.id))
    .map((c) => ({
      consultantId: c.id,
      consultantName: `${c.firstName} ${c.lastName}`,
      expertise: c.expertise,
      experience: c.experience,
      rating: c.rating ?? 0,
      availableSlots: slotMap.get(c.id) || [],
    }));

  // 9. RETURN
  return {
    sessionId: session.id,
    assistantMessage: {
      id: assistantMessage.id,
      content: assistantMessage.content,
      role: assistantMessage.role,
      createdAt: assistantMessage.createdAt,
    },
    consultantCards,
  };
};

// export const handleChat = async (data: ICreateChatMessage) => {
//   let session;

//   // 1. SESSION (unchanged but safe)
//   if (data.sessionId) {
//     session = await prisma.chatSession.findUnique({
//       where: { id: data.sessionId },
//     });

//     if (!session || session.userId !== data.userId) {
//       throw new Error("Unauthorized session");
//     }
//   } else {
//     session = await prisma.chatSession.create({
//       data: { userId: data.userId },
//     });
//   }

//   // 2. SAVE USER MESSAGE
//   await prisma.chatMessage.create({
//     data: {
//       sessionId: session.id,
//       userId: data.userId,
//       role: "USER",
//       content: data.content,
//     },
//   });

//   // 3. PARALLELIZE DB CALLS (IMPORTANT SPEED FIX)
//   const [history, consultants, slots] = await Promise.all([
//     prisma.chatMessage.findMany({
//       where: { sessionId: session.id },
//       orderBy: { createdAt: "asc" },
//       take: 20,
//     }),

//     prisma.consultant.findMany({
//       orderBy: { rating: "desc" },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         expertise: true,
//         experience: true,
//         rating: true,
//       },
//     }),

//     prisma.timeSlot.findMany({
//       where: { status: "AVAILABLE" },
//       select: {
//         consultantId: true,
//         startTime: true,
//         endTime: true,
//       },
//     }),
//   ]);

//   // 4. FIX N+1 PROBLEM (REMOVE timeSlotService LOOP ❌)

//   const slotMap = new Map<string, any[]>();

//   for (const s of slots) {
//     if (!slotMap.has(s.consultantId)) {
//       slotMap.set(s.consultantId, []);
//     }

//     slotMap.get(s.consultantId)!.push({
//       startTime: s.startTime,
//       endTime: s.endTime,
//     });
//   }

//   // 5. BUILD LIGHTWEIGHT CONSULTANT DATA (FASTER AI INPUT)
//   const consultantsWithSlots = consultants.map((c) => ({
//     consultantId: c.id,
//     consultantName: `${c.firstName} ${c.lastName}`,
//     expertise: c.expertise,
//     experience: c.experience,
//     rating: c.rating,
//     availableSlots: (slotMap.get(c.id) || []).slice(0, 3), // LIMIT SIZE
//   }));

//   // 6. SYSTEM PROMPT (UNCHANGED)
//   const systemPrompt = SYSTEM_PROMPT.replace(
//     "{{CONSULTANT_DATA}}",
//     JSON.stringify(consultantsWithSlots)
//   );

//   // 7. BUILD AI MESSAGES
//   const aiMessages = [
//     { role: "system", content: systemPrompt },
//     ...history.map((m: any) => ({
//       role: m.role === "USER" ? "user" : "assistant",
//       content: m.content,
//     })),
//   ];

//   // 8. AI CALL (SAFE + FAST FAIL)
//   let aiText;

//   try {
//     aiText = await generateAIResponse(aiMessages as any);
//   } catch (err: any) {
//     console.error("AI ERROR:", err);

//     aiText =
//       "I'm having trouble responding right now. Please try again in a moment.";
//   }

//   // 9. SAVE RESPONSE
//   const assistantMessage = await prisma.chatMessage.create({
//     data: {
//       sessionId: session.id,
//       role: "ASSISTANT",
//       content: aiText,
//     },
//   });

//   return {
//     sessionId: session.id,
//     assistantMessage,
//   };
// };