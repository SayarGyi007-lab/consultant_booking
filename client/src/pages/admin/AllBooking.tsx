import { useState } from "react";
import BookingGrid from "../../components/admin/BookingGrid";
import { useBookings } from "../../hooks/useBookings";
import useDebounce from "../../hooks/useDebounce";
import Button from "../../ui/components/Button";
import StatusToggle from "../../ui/Toggle";
import { useCancelBookingMutation } from "../../slices/redux-slices/booking-api";

type BookingStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED";

const AllBookings = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<BookingStatus>("CONFIRMED");

  const limit = 10;
  const debounceSearch = useDebounce(search, 500);

  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();

  const { bookings, bookingsPagination } = useBookings({
    page,
    limit,
    search: debounceSearch,
    status,
  });

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id).unwrap();
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  const hasNextPage = page < (bookingsPagination?.totalPages ?? 1);
  const hasPreviousPage = page > 1;

  return (
    <div className="p-4 lg:p-6 min-h-screen w-full overflow-x-hidden">

      {/* header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Bookings</h1>

        <input
          type="text"
          placeholder="Search by consultant/user..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border w-full sm:w-[300px] rounded-lg px-4 py-2"
        />
      </div>

      {/* filter */}
      <div className="mb-4">
        <StatusToggle
          value={status}
          options={["CONFIRMED", "CANCELLED", "COMPLETED"]}
          onChange={(val) => setStatus(val)}
          labels={{
            CONFIRMED: "Confirmed",
            CANCELLED: "Cancelled",
            COMPLETED: "Completed",
          }}
          colors={{
            CONFIRMED: "bg-green-500 text-white",
            CANCELLED: "bg-red-500 text-white",
            COMPLETED: "bg-blue-500 text-white",
          }}
        />
      </div>

      {/* grid */}
      {bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No bookings found
        </div>
      ) : (
        <BookingGrid
          bookings={bookings}
          // title={`${status.charAt(0) + status.slice(1).toLowerCase()} Bookings`}
          onCancel={handleCancel}
          isCancelling={isCancelling}
          page={page}
          limit={limit}
        />
      )}

      {/* pagination */}
      <div className="grid grid-cols-3 items-center mt-6">
        <div>
          {hasPreviousPage && (
            <Button onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
          )}
        </div>

        <div className="text-center text-sm">
          Page {page} / {bookingsPagination?.totalPages ?? 1}
        </div>

        <div className="flex justify-end">
          {hasNextPage && (
            <Button onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBookings;