// src/slices/chatApiSlice.ts

import type { ChatResponse, SendMessageInputs } from "../interfaces/chat";
import { apiSlice } from "./api";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    sendMessage: builder.mutation<ChatResponse, SendMessageInputs>({
      query: (data) => ({
        url: "chat",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {useSendMessageMutation} = chatApiSlice