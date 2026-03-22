import { useGetAvailableSlotsByConsultantQuery } from "../../slices/redux-slices/time-slot-api";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";
import { dateOptions, timeOptions } from "../../utils/date-time";

const ConsultantCard = ({ consultant }: any) => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetAvailableSlotsByConsultantQuery(consultant.id);

  const slots = data?.data || [];

  return (
    <div className="border rounded-xl p-4 hover:shadow-md transition">

      <p className="font-semibold text-lg">
        {consultant.firstName} {consultant.lastName}
      </p>

      <span className="inline-block text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full mt-1">
        {consultant.expertise}
      </span>

      <p className="text-sm mt-2">
        <a
          href={`mailto:${consultant.email}`}
          className="text-blue-600 hover:underline"
        >
          {consultant.email}
        </a>
      </p>

      <p className="text-sm">
        <a
          href={`tel:${consultant.phone}`}
          className="text-blue-600 hover:underline"
        >
          {consultant.phone}
        </a>
      </p>

      <div className="mt-3">
        <p className="text-sm font-medium mb-1">Available Slots:</p>

        {isLoading ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : slots.length === 0 ? (
          <p className="text-xs text-gray-400">No slots</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.slice(0, 3).map((slot) => (
              <button
                key={slot.id}
                onClick={() => navigate('/booking', {
                  state: {
                    consultant,
                    slot
                  }
                })}
                className="text-xs border px-2 py-1 rounded hover:bg-black hover:text-white"
              >
                {new Date(slot.startTime).toLocaleDateString(undefined, dateOptions)}{' '}
                {new Date(slot.startTime).toLocaleTimeString(undefined, timeOptions)} -{' '}
                {new Date(slot.endTime).toLocaleTimeString(undefined, timeOptions)}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        className="mt-3 w-full"
        size="sm"
        onClick={() => navigate(`/consultants/${consultant.id}`)}
      >
        View More
      </Button>
    </div>
  );
};

export default ConsultantCard;