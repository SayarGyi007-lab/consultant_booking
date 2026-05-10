import { useState } from "react";
import Button from "../../ui/components/Button";
import { useMyBookings } from "../../hooks/useBookings";
import StatusToggle from "../../ui/Toggle";
import type { Booking } from "../../slices/interfaces/booking";
import BookingGrid from "../../components/admin/BookingGrid";
import ReviewModal from "../../components/user/Review";
import { useCancelBookingMutation } from "../../slices/redux-slices/booking-api";

type BookingStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED";

const MyBookings = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<BookingStatus>("CONFIRMED");
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [open, setOpen] = useState(false);

  const { bookings:rawBookings, bookingsPagination, refetch } = useMyBookings({
    page,
    limit: 6,
    status
  });

  const bookings = rawBookings.map((b) =>
    reviewedIds.has(b.id) && !b.review
      ? { ...b, review: { id: "temp" } as any }
      : b
  );

  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();

  const totalPages = bookingsPagination?.totalPages || 1;

  const openReviewModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-6">

      {/* header */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            My Bookings
          </h1>
          <p className="text-sm text-gray-500">
            Manage your sessions and leave reviews
          </p>
        </div>

        <StatusToggle
          value={status}
          options={["CONFIRMED", "COMPLETED", "CANCELLED"]}
          onChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          labels={{
            CONFIRMED: "Upcoming",
            COMPLETED: "Completed",
            CANCELLED: "Cancelled"
          }}
          colors={{
            CONFIRMED: "bg-green-500 text-white",
            COMPLETED: "bg-blue-500 text-white",
            CANCELLED: "bg-red-500 text-white"
          }}
        />
      </div>

      {/* content */}
      <div className="bg-[#cfe6f2] rounded-2xl shadow-sm border p-5">

        {bookings.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No bookings found
          </div>
        ) : (
          <BookingGrid
            bookings={bookings}
            // page={page}
            // limit={6}
            onCancel={handleCancel}              
            isCancelling={isCancelling}
            onOpenReview={openReviewModal}
            showReview={status === "COMPLETED"} 
          />
        )}

        {/* pagination */}
        <div className="flex items-center  justify-between mt-8 border-t pt-4">
          <Button
            variant='uncommon'
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </Button>

          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>

          <Button
            variant="uncommon"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </Button>
        </div>
      </div>

      {selectedBooking && (
        <ReviewModal
          open={open}
          onClose={() => setOpen(false)}
          booking={selectedBooking}
          onSuccess={(bookingId) => {
            setReviewedIds((prev) => new Set(prev).add(bookingId)); // instant UI update
            refetch(); // sync with server in background
          }}
        />
      )}
    </div>
  );
};

export default MyBookings;