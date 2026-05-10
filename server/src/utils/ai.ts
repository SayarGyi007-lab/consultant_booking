import { config } from "../config/config";
import OpenAI from "openai";

export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: config.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:8000', 
    'X-OpenRouter-Title': 'Consultify AI', 
  },
});