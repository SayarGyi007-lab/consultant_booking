// src/components/chat/ChatButton.tsx
import { MessageCircle } from "lucide-react";

export default function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
    >
      <MessageCircle size={24} />
    </button>
  );
}