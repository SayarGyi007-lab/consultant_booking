import type { Booking } from "../../slices/interfaces/booking";

interface Props {
  bookings: Booking[];
  maxVisible?: number; 
  onSeeAll?: () => void; 
}

const ProfileBooking = ({ bookings, maxVisible = 3, onSeeAll }: Props) => {
  const recentBookings = bookings.slice(0, maxVisible);

  return (
    <div className="mt-8">

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#111d23]">
          Recent Bookings
        </h3>

        {onSeeAll && bookings.length > maxVisible && (
          <button
            onClick={onSeeAll}
            className="text-indigo-600 text-sm font-semibold hover:underline"
          >
            See All
          </button>
        )}
      </div>

      {recentBookings.length === 0 ? (
        <p className="text-gray-400 text-sm">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex justify-between items-center p-4 rounded-xl border border-gray-200 bg-white hover:bg-[#e9f6fd] transition"
            >
              <div>
                <p className="font-semibold text-[#111d23]">
                  {booking.slot?.consultant
                    ? `${booking.slot.consultant.firstName} ${booking.slot.consultant.lastName}`
                    : "N/A"} <span className="bg-[#0a6468]/30 rounded-lg px-2 py-1 text-xs text-[#004b4e]">{booking.slot?.consultant?.expertise}</span>
                </p>

                <p className="text-sm text-gray-500">
                  {booking.slot
                    ? `${new Date(booking.slot.startTime).toLocaleDateString()} • ${new Date(
                        booking.slot.startTime
                      ).toLocaleTimeString()}`
                    : "No slot info"}
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-[#a6eff3] text-black font-semibold">
                {booking.status ?? "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileBooking;