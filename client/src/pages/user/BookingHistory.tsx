import { useState } from "react";
import Button from "../../ui/Button";
import { useMyBookings } from "../../hooks/useBookings";
import UpcomingBookings from "../../components/user/UpcomingBooking";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate()

  const { bookings, bookingsPagination, isLoading } = useMyBookings({
    page,
    limit: 6,
  });

  const totalPages = bookingsPagination?.totalPages || 1;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-gray-500">View and manage your bookings</p>
      </div>

      <UpcomingBookings
        bookings={bookings}
        isLoading={isLoading}
        title="Booking History"
      />

      {/* Pagination */}
      <div className="flex item-center justify-between">
        <div>
          <Button onClick={()=>navigate('/home')}>
            Back
          </Button>
        </div>

        <div className="flex mx-auto gap-3 items-center">
          <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </Button>

        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;