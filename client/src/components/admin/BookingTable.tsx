import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { Booking } from "../../slices/interfaces/booking";
import Button from "../../ui/Button";
import DeleteWarning from "../../ui/DeleteWarning";
import { dateOptions, timeOptions } from "../../utils/date-time";

interface Props {
  bookings: Booking[];
  title?: string;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  page: number;
  limit: number;
}

const RecentBookingsTable = ({
  bookings,
  title = "Recent Bookings",
  onDelete,
  isDeleting,
  page,
  limit
}: Props) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      onDelete?.(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm w-full">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[1400px] text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b border-gray-200">
              <th className="px-4 py-3 whitespace-nowrap font-medium">No.</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Booking ID</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">User</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">User Phone</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">User Email</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Customer</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Consultant</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Date</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Time</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Status</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => {
              const start = booking.slot?.startTime ? new Date(booking.slot.startTime) : null;
              const end = booking.slot?.endTime ? new Date(booking.slot.endTime) : null;

              return (
                <tr key={booking.id} className="hover:bg-gray-50 text-sm border-b border-gray-100">
                  <td className="px-4 py-3">{(page - 1) * limit + index + 1}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{booking.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    {booking.user
                      ? `${booking.user.firstName} ${booking.user.lastName}`
                      : booking.customerName ?? "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.user?.phone ?? "—"}</td>
                  <td className="px-4 py-3">{booking.user?.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="block whitespace-nowrap font-medium">{booking.customerName ?? "—"}</span>
                    <span className="text-xs text-gray-500">{booking.customerEmail ?? ""}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block whitespace-nowrap font-medium">
                      {booking.slot?.consultant
                        ? `${booking.slot.consultant.firstName} ${booking.slot.consultant.lastName}`
                        : "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">{booking.slot?.consultant?.email ?? ""}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                    {start
                      ? start.toLocaleDateString(undefined, dateOptions)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                    {start && end
                      ? `${start.toLocaleTimeString(undefined, timeOptions)} - ${end.toLocaleTimeString(undefined, timeOptions)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 whitespace-nowrap">
                      {booking.slot?.status ?? "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    <div className="flex justify-center items-center">
                      <Button variant="danger" size="icon" onClick={() => setDeleteId(booking.id)}>
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DeleteWarning
        open={!!deleteId}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        confirmText="Delete"
        loading={isDeleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default RecentBookingsTable;