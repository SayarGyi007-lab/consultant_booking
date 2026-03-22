import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { Booking } from "../../slices/interfaces/booking";
import Button from "../../ui/Button";
import DeleteWarning from "../../ui/DeleteWarning";

interface Props {
  bookings: Booking[];
  title?: string;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const RecentBookingsTable = ({
  bookings,
  title = "Recent Bookings",
  onDelete,
  isDeleting,
}: Props) => {

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      onDelete?.(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="overflow-x-auto w-full">
        <table className="min-w-[1400px] text-left border-separate border-spacing-x-6 border-spacing-y-2">

          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th>No.</th>
              <th className="pb-3">Booking ID</th>
              <th>User</th>
              <th>User Phone</th>
              <th>User Email</th>
              <th>Customer Name</th>
              <th>Customer Email</th>
              <th>Consultant</th>
              <th>Consultant Phone</th>
              <th>Consultant Email</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => {

              const start = booking.slot?.startTime
                ? new Date(booking.slot.startTime)
                : null;

              const end = booking.slot?.endTime
                ? new Date(booking.slot.endTime)
                : null;

              return (
                <tr key={booking.id} className="bg-white text-sm hover:bg-gray-50">
                  <td className="py-3">{index + 1}</td>

                  <td className="py-3">{booking.id}</td>

                  <td className="whitespace-nowrap min-w-[180px]">
                    {booking.user
                      ? `${booking.user.firstName} ${booking.user.lastName}`
                      : booking.customerName ?? "—"}
                  </td>

                  <td>{booking.user?.phone ?? "—"}</td>

                  <td>{booking.user?.email ?? "—"}</td>

                  <td>{booking.customerName ?? "—"}</td>

                  <td>{booking.customerEmail ?? "—"}</td>

                  <td>
                    {booking.slot?.consultant
                      ? `${booking.slot.consultant.firstName} ${booking.slot.consultant.lastName}`
                      : "Unknown"}
                  </td>

                  <td>{booking.slot?.consultant?.phone ?? "—"}</td>

                  <td>{booking.slot?.consultant?.email ?? "—"}</td>

                  <td>{start ? start.toLocaleDateString() : "—"}</td>

                  <td>
                    {start
                      ? start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </td>

                  <td>
                    {end
                      ? end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </td>

                  <td>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      {booking.slot?.status ?? "Unknown"}
                    </span>
                  </td>

                  <td>
                    <Button
                      variant="danger"
                      size="icon"
                      onClick={() => setDeleteId(booking.id)}
                      className="hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* DELETE CONFIRMATION MODAL */}

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
}

export default RecentBookingsTable