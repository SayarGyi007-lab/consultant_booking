import { useNavigate } from "react-router-dom";
import { RiRobot2Fill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";


export default function ChatWindow({ messages, loading }: any) {
  const navigate = useNavigate();

  const handleBook = (consultant: any, slot: any) => {
  const normalizedConsultant = {
    id: consultant.consultantId,
    firstName: consultant.name?.split(" ")[0] || "",
    lastName: consultant.name?.split(" ").slice(1).join(" ") || "",
    expertise: consultant.expertise,
  };

  const normalizedSlot = {
    id: slot.slotId,
    startTime: slot.startTime,
    endTime: slot.endTime,
  };

  navigate("/booking", {
    state: {
      consultant: normalizedConsultant,
      slot: normalizedSlot,
    },
  });
};

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg: any, i: number) => {
        const isUser = msg.role === "USER";

        return (
          <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className="flex items-end gap-2 max-w-[85%]">

              {/* ai avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#d7e4ec] flex items-center justify-center">
                  <RiRobot2Fill />
                </div>
              )}

              {/* message */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                  isUser
                    ? "bg-[#24389c] text-white rounded-tr-none"
                    : "bg-white text-[#111d23] rounded-tl-none"
                }`}
              >
                <p>{msg.content}</p>

                {/* consultants */}
                {msg.consultants?.map((consultant: any) => (
                  <div key={consultant.consultantId} className="mt-4 border-t pt-3">

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm">
                          {consultant.consultantName}
                        </p>

                        <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                          {consultant.expertise}
                        </span>
                      </div>

                      <p className="text-xs text-[#004b4e]">
                        ★ {consultant.rating ?? "—"}
                      </p>
                    </div>

                    {/* slots */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {consultant.availableSlots.length > 0 ? (
                        consultant.availableSlots.map((slot: any) => (
                          <button
                            key={slot.slotId}
                            onClick={() => handleBook(consultant, slot)}
                            className="text-xs px-3 py-1 rounded-full border hover:bg-indigo-600 hover:text-white transition"
                          >
                            {new Date(slot.startTime).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            •{" "}
                            {new Date(slot.startTime).toLocaleTimeString("en-TH", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400">
                          No available slots
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* user avatar */}
              {isUser && (
                <div className="w-8 h-8 rounded-full bg-[#24389c] text-white flex items-center justify-center">
                  <FaUser />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* loading */}
      {loading && (
        <div className="flex gap-2 items-center opacity-70">
          <div className="w-8 h-8 rounded-full bg-[#d7e4ec] flex items-center justify-center">
            <RiRobot2Fill />
          </div>

          <div className="flex space-x-1 px-3 py-2 bg-white rounded-full">
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      )}
    </div>
  );
}