import { useNavigate } from "react-router-dom";
import { CalendarCheck, Plus } from "lucide-react";
import { useMyBookings } from "../../hooks/useBookings";
import Button from "../../ui/Button";
import { useConsultants } from "../../hooks/useConsultants";
import ConsultantCard from "../../components/user/ConsultantCard";
import UpcomingBookings from "../../components/user/UpcomingBooking";

const Home = () => {
  const navigate = useNavigate();

  const { bookings, bookingsPagination, isLoading } = useMyBookings({
    page: 1,
    limit: 3,
  });
  const { consultants, isLoading: consultantsLoading } = useConsultants({
    page: 1,
    limit: 3,
    status: "active"
  });

  const handleBookAppointment = () => {
    navigate('/booking')
  }

  const handleMyBooking = () => {
    navigate('/my-bookings')
  }

  const totalBookings = bookingsPagination?.total || 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome</h1>
        <p className="text-gray-500">
          Manage your bookings and schedule easily
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="common" onClick={handleBookAppointment}>
          <Plus size={18} />
          Book Appointment
        </Button>

        <Button variant="outline" onClick={handleMyBooking}>
          <CalendarCheck size={18} />
          My Bookings
        </Button>
      </div>


      {/* Consultant */}
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Available Consultants</h2>
          <p
            onClick={() => navigate('/all-consultants')}
            className="text-sm text-blue-500 cursor-pointer hover:underline"
          >
            View More
          </p>
        </div>

        {consultantsLoading ? (
          <p>Loading...</p>
        ) : consultants.length === 0 ? (
          <p className="text-gray-500">No consultants available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {consultants.map((c) => (
              <ConsultantCard key={c.id} consultant={c} />
            ))}
          </div>
        )}
      </div>


      {/* Booking */}
      <h2>Booking</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl shadow bg-white">
          <p className="text-gray-500 text-sm">Total Bookings</p>
          <h2 className="text-xl font-bold">{totalBookings}</h2>
        </div>
      </div>

      <UpcomingBookings
        bookings={bookings}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Home;