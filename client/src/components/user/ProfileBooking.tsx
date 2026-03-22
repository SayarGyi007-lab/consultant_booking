import type { Booking } from "../../slices/interfaces/booking";
import Button from "../../ui/Button";

interface Props {
  bookings: Booking[];
  maxVisible?: number; 
  onSeeAll?: () => void; 
}

const ProfileBooking = ({ bookings, maxVisible = 3, onSeeAll }: Props) => {
  const recentBookings = bookings.slice(0, maxVisible);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Booking History</h3>
        {onSeeAll && bookings.length > maxVisible && (
          <Button
            variant="uncommon"
            className="border text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md"
            onClick={onSeeAll}
          >
            See All
          </Button>
        )}
      </div>

      {recentBookings.length === 0 ? (
        <p className="text-gray-400 text-sm">No bookings yet.</p>
      ) : (
        <div className="space-y-4 max-h-72 overflow-y-auto">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 border rounded-xl flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {booking.slot?.consultant
                    ? `${booking.slot.consultant.firstName} ${booking.slot.consultant.lastName}`
                    : "N/A"}
                </p>
                <p className="text-gray-500 text-sm">
                  {booking.slot
                    ? `${new Date(booking.slot.startTime).toLocaleDateString()} ${new Date(
                        booking.slot.startTime
                      ).toLocaleTimeString()} - ${new Date(
                        booking.slot.endTime
                      ).toLocaleTimeString()}`
                    : "No slot info"}
                </p>
                <p className="text-gray-400 text-xs">
                  {booking.slot?.consultant?.phone && `${booking.slot.consultant.phone}`}{" | "}
                  {booking.slot?.consultant?.email && `${booking.slot.consultant.email}`}
                </p>
              </div>
              <span className="text-sm text-gray-400">{booking.slot?.status ?? "Pending"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileBooking;