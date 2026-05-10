import { useNavigate } from "react-router-dom";
import Button from "../../ui/components/Button";
import { useGetAvailableSlotsByConsultantQuery } from "../../slices/redux-slices/time-slot-api";
import { MdOutlineEmail } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";


const ConsultantCard = ({ consultant }: any) => {
  const navigate = useNavigate();
  const { data, isLoading } =
    useGetAvailableSlotsByConsultantQuery(consultant.id);

  const slots = data?.data || [];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-lg">
            {consultant.firstName} {consultant.lastName}
          </p>

          <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full mt-1 inline-block">
            {consultant.expertise}
          </span>
        </div>

        <div className="text-sm text-[#004b4e]">
          ★ {consultant.rating ?? "—"}
        </div>
      </div>

      {/* contact */}
      <div className="mt-4 flex flex-col gap-2">
        <a
          href={`mailto:${consultant.email}`}
          className="text-sm px-3 py-2 rounded-lg bg-gray-50 gap-2 flex items-center hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <MdOutlineEmail /> {consultant.email}
        </a>

        <a
          href={`tel:${consultant.phone}`}
          className="text-sm px-3 py-2 rounded-lg flex items-center gap-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <MdLocalPhone /> {consultant.phone}
        </a>
      </div>

      {/* slots */}
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">
          Available Slots
        </p>

        {isLoading ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : slots.length === 0 ? (
          <p className="text-xs text-gray-400">
            No slots available
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.slice(0, 4).map((slot: any) => (
              <button
                key={slot.id}
                onClick={() =>
                  navigate("/booking", {
                    state: { consultant, slot },
                  })
                }
                className="text-xs px-3 py-1 rounded-full border hover:bg-indigo-600 hover:text-white transition"
              >
                {new Date(slot.startTime).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}{" "}
                •{" "}
                {new Date(slot.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        className="mt-5 w-full rounded-full"
        size="sm"
        onClick={() => navigate(`/consultants/${consultant.id}`)}
      >
        View Profile
      </Button>
    </div>
  );
};

export default ConsultantCard;