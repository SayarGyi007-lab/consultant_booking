import { useState } from "react";
import type { Booking } from "../../slices/interfaces/booking";
import DeleteWarning from "../../ui/DeleteWarning";
import { dateOptions, timeOptions } from "../../utils/date-time";
import { Calendar, Clock2 } from "lucide-react";
import Button from "../../ui/components/Button";
import { useCurrentUser } from "../../hooks/useUsers";

interface Props {
  bookings: Booking[];
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
  onOpenReview?: (booking: Booking) => void;
  showReview?: boolean;
  page?: number;
  limit?: number;
  title?: string
}

const BookingTable = ({
  bookings,
  onCancel,
  isCancelling,
  onOpenReview,
  showReview = false,
  page = 1,
  limit = 6,
  title,
}: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { user } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const confirmCancel = () => {
    if (!selectedId) return;
    onCancel?.(selectedId);
    setSelectedId(null);
  };

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-[#a6eff3] text-black";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <h1 className="text-xl pb-2 font-bold">{title}</h1>
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border">

        {/* header */}
        <div className="hidden md:flex px-8 py-4 text-xs uppercase bg-[#cfe6f2] text-gray-500 font-semibold border-b">
          {isAdmin && <div className="flex-shrink-0 mr-4">#</div>}
          <div className="flex-1">Session & Expert</div>
          <div className="flex-1 pl-10">Date & Time</div>
          <div className="flex-1 pl-5">Status</div>
          <div className="flex-1 text-right pr-5">Actions</div>
        </div>

        {/* rows */}
        {bookings.map((booking, index) => {
          const start = booking.slot?.startTime
            ? new Date(booking.slot.startTime)
            : null;

          const end = booking.slot?.endTime
            ? new Date(booking.slot.endTime)
            : null;

          return (
            <div
              key={booking.id}
              className="flex flex-col md:flex-row md:items-center px-8 py-6 border-b"
            >
              {/* no. */}
              {isAdmin && (
                <div className="flex-shrink-0 mr-4 text-xs font-mono text-gray-400 mb-2 md:mb-0">
                  {((page - 1) * limit) + index + 1}
                </div>
              )}

              {/* session */}
              <div className="flex-1 mb-4 md:mb-0">
                {isAdmin && (
                  <p className="text-[10px] text-gray-400 font-mono mb-1">
                    ID: {booking.id}
                  </p>
                )}

                <h3 className="font-semibold text-gray-900">
                  {booking.slot?.consultant?.expertise + " Session" || "Consultation Session"}
                </h3>

                <p className="text-sm text-gray-500">
                  with{" "}
                  {booking.slot?.consultant
                    ? `${booking.slot.consultant.firstName} ${booking.slot.consultant.lastName}`
                    : "Unknown"}
                </p>
              </div>

              {/* time */}
              <div className="flex-1 mb-4 md:mb-0 text-sm">
                <div className="flex items-center gap-2 text-gray-800">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {start
                      ? start.toLocaleDateString(undefined, dateOptions)
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <Clock2 className="w-4 h-4" />
                  <span>
                    {start && end
                      ? `${start.toLocaleTimeString(undefined, timeOptions)} - ${end.toLocaleTimeString(undefined, timeOptions)}`
                      : "—"}
                  </span>
                </div>
              </div>

              {/* status */}
              <div className="flex-1 mb-4 md:mb-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>

              {/* actions */}
              <div className="flex-1 flex justify-end">
                {booking.status === "CONFIRMED" && (
                  <Button
                    variant="danger"
                    onClick={() => setSelectedId(booking.id)}
                  >
                    Cancel
                  </Button>
                )}

                {showReview && booking.status === "COMPLETED" && (
                  <button
                    disabled={!!booking.review}
                    onClick={() => onOpenReview?.(booking)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:-translate-y-0.5 transition disabled:opacity-50"
                  >
                    {booking.review ? "Reviewed" : "Write Review"}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {bookings.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            No bookings found
          </div>
        )}
      </div>

      {/* confirm */}
      <DeleteWarning
        open={!!selectedId}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmText="Yes"
        loading={isCancelling}
        onCancel={() => setSelectedId(null)}
        onConfirm={confirmCancel}
      />
    </>
  );
};

export default BookingTable;