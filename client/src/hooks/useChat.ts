import { useState } from "react";
import { useSendMessageMutation } from "../slices/redux-slices/chat";

export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>();

  const [sendMessageApi, { isLoading }] = useSendMessageMutation();

  const resetChat = () => {
    setMessages([]);
    setSessionId(undefined);
  };

  const sendLocalMessage = (message: any) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage = { role: "USER", content };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await sendMessageApi({ content, sessionId }).unwrap();

      setSessionId(res.sessionId);

      setMessages((prev) => [...prev, 
        {
          ...res.assistantMessage,
          consultants: res.consultantCards
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m !== userMessage));
    }
  };

  return { messages, sendMessage, isLoading, resetChat, sendLocalMessage };
};

export const useChatWidget = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return { open, toggle, close };
};