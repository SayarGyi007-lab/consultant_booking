import { useEffect, useRef } from "react";
import ChatWindow from "../../ui/components/chat/ChatWindow";
import ChatInput from "../../ui/components/chat/ChatInput";
import { useChat } from "../../hooks/useChat";
import { RiRobot2Fill } from "react-icons/ri";

export default function ChatBox({ onClose }: { onClose: () => void }) {
  const {
    messages,
    sendMessage,
    isLoading,
    resetChat,
    sendLocalMessage,
  } = useChat();

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (messages.length === 0) {
      const introMessage = {
        role: "ASSISTANT",
        content:
          "Hello! I'm your digital concierge. How can I assist you with your bookings today?",
      };

      sendLocalMessage(introMessage);
    }
  }, []);

  const handleClose = () => {
    resetChat();
    onClose();
    initialized.current = false;
  };

  return (
    <div
      className="
      fixed bottom-6 right-6 z-[60]
      w-[380px] max-w-[calc(100vw-48px)]
      h-[600px] max-h-[calc(100vh-48px)]
      flex flex-col
      rounded-2xl overflow-hidden
      shadow-2xl backdrop-blur-xl
      bg-white/70 border border-[#c5c5d4]/20
    "
    >
      {/* header */}
      <div className="bg-[#3f51b5] p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <RiRobot2Fill />
          </div>
          <div>
            <h4 className="font-bold tracking-tight">Consultify AI</h4>
            <p className="text-[10px] uppercase tracking-widest opacity-80">
              Digital Concierge • Online
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full"
        >
          ✕
        </button>
      </div>

      {/* chat area */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#e9f6fd]/40">
        <ChatWindow messages={messages} loading={isLoading} />
      </div>

      {/* input */}
      <div className="p-4 bg-white border-t border-[#c5c5d4]/20">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}