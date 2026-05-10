import { openai } from "../utils/ai";


export const generateAIResponse = async (messages: any[]) => {
  try {
    const response = await openai.chat.completions.create({
      model: "openrouter/free",
      messages,
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) throw new Error("Empty AI response");

    return content;
  } catch (err: any) {
    if (err?.status === 429) {
      throw new Error("AI rate limit exceeded");
    }
    throw err;
  }
};