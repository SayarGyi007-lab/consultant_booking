import { useState } from "react";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-3 bg-[#e3f0f8] rounded-xl px-4 py-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask something..."
        className="flex-1 bg-transparent outline-none text-sm text-[#111d23] placeholder:text-gray-400"
      />

      <button
        onClick={handleSend}
        className="w-10 h-10 bg-[#24389c] text-white rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition"
      >
        ➤
      </button>
    </div>
  );
}