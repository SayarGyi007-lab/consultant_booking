import { useState } from "react";
import RecentBookingsTable from "../../components/admin/BookingTable";
import { useBookings } from "../../hooks/useBookings";
import useDebounce from "../../hooks/useDebounce";
import Button from "../../ui/Button";
import { useDeleteBookingMutation } from "../../slices/redux-slices/booking-api";

const  AllBookings = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const limit = 10;

    const debounceSearch = useDebounce(search, 500);

    const [deleteBooking, { isLoading }] = useDeleteBookingMutation();

    const handleDelete = async (id: string) => {
        try {
            await deleteBooking(id).unwrap();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const { bookings, bookingsPagination } = useBookings({
        page,
        limit,
        search: debounceSearch,
    });
    console.log(bookings);

    const hasNextPage = page < (bookingsPagination?.totalPages ?? 1);
    const hasPreviousPage = page > 1

    return (
        <div className="p-6 min-h-screen w-full">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Bookings</h1>

                <input
                    type="text"
                    placeholder="Search by User/Consultant..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="border w-[300px] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Table */}
            {bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No bookings found
                </div>
            ) : (
                <RecentBookingsTable
                    bookings={bookings}
                    title="All Bookings"
                    onDelete={handleDelete}
                    isDeleting = {isLoading}
                />
            )}

            {/* Pagination */}
            <div className="grid grid-cols-3 items-center mt-6">

                <div className="flex justify-start">
                    {hasPreviousPage && (
                        <Button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            variant="outline"
                        >
                            Previous
                        </Button>
                    )}
                </div>

                <div className="text-center text-sm font-medium">
                    Page {page} of {bookingsPagination?.totalPages ?? 1}
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
}

export default AllBookings