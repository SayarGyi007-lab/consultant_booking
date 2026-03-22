import type { Booking } from "../../slices/interfaces/booking";

interface Props {
  bookings: Booking[];
  isLoading?: boolean;
  title?: string;
}

const UpcomingBookings = ({ bookings, isLoading, title = "Upcoming Bookings" }: Props) => {
  const now = new Date();

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.slot?.startTime || "") > now
  );

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : upcomingBookings.length === 0 ? (
        <p className="text-gray-500">No upcoming bookings</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingBookings.map((b) => {
            const consultant = b.slot?.consultant;

            return (
              <div
                key={b.id}
                className="border rounded-xl p-6 hover:shadow-md transition"
              >
                <p className="font-semibold text-lg">
                  {consultant?.firstName} {consultant?.lastName}
                  <span className="ml-3 inline-block text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                    {consultant?.expertise}
                  </span>
                </p>

                <p className="text-sm text-gray-500 mb-2">
                  {new Date(b.slot?.startTime || "").toLocaleString()}
                </p>

                <p className="text-sm">
                  <a
                    href={`mailto:${consultant?.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {consultant?.email || "N/A"}
                  </a>
                </p>

                <p className="text-sm">
                  <a
                    href={`tel:${consultant?.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {consultant?.phone || "N/A"}
                  </a>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingBookings;