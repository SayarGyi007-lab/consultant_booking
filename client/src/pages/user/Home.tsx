import { useNavigate } from "react-router-dom";
import { useMyBookings } from "../../hooks/useBookings";
import { useConsultants } from "../../hooks/useConsultants";
import ConsultantCard from "../../components/user/ConsultantCard";
import Button from "../../ui/components/Button";
import { MdLocalPhone, MdOutlineEmail } from "react-icons/md";

const Home = () => {
  const navigate = useNavigate();

  const { bookings, bookingsPagination, isLoading } = useMyBookings({
    page: 1,
    limit: 5,
  });


  const { consultants, isLoading: consultantsLoading } = useConsultants({
    page: 1,
    limit: 3,
    status: "active",
    available: "AVAILABLE",
  });


  const totalBookings = bookingsPagination?.total || 0;

  const now = new Date();

  const upcoming = bookings
    ?.filter((b) => new Date(b.slot?.startTime || "") > now)
    ?.sort(
      (a, b) =>
        new Date(a.slot?.startTime || "").getTime() -
        new Date(b.slot?.startTime || "").getTime()
    )[0];
    

  const consultant = upcoming?.slot?.consultant;

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-10">

      {/* HEADER */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-2">
            Manage your bookings and connect with experts easily.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button onClick={() => navigate("/booking")}>
            Book Appointment
          </Button>

          <Button variant="outline" onClick={() => navigate("/my-bookings")}>
            My Bookings
          </Button>
        </div>
      </section>

      {/* grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* upcoming booking */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl p-6 shadow border">

            {isLoading ? (
              <p>Loading...</p>
            ) : upcoming ? (
              <>
                <span className="inline-block text-xs font-bold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full mb-4">
                  Upcoming Session
                </span>

                <h2 className="text-2xl font-bold">
                  {consultant?.expertise}
                </h2>

                <div className="mt-2 flex items-center gap-3 flex-wrap">

                  {/* date */}
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-600">
                    {new Date(upcoming.slot?.startTime || "").toLocaleDateString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  {/* time */}
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(upcoming.slot?.startTime || "").toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                </div>

                <div className="mt-6">
                  <p className="text-lg font-semibold">
                    {consultant?.firstName} {consultant?.lastName}
                  </p>

                  {/* actions */}
                  <div className="flex gap-3 mt-4 flex-wrap">
                    <a
                      href={`mailto:${consultant?.email}`}
                      className="px-4 py-2 rounded-full flex items-center gap-2 bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                    >
                      <MdOutlineEmail /> Email
                    </a>

                    <a
                      href={`tel:${consultant?.phone}`}
                      className="px-4 py-2 rounded-full flex items-center gap-2 bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition"
                    >
                      <MdLocalPhone /> Call
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No upcoming sessions</p>
            )}
          </div>
        </div>

        {/* stats */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl p-6 shadow border">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <h2 className="text-3xl font-bold mt-2">
              {totalBookings}
            </h2>
          </div>
        </div>
      </section>

      {/* consultants */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-2xl font-bold">
              Available Consultants
            </h3>
            <p className="text-gray-500">
              Book sessions with top experts
            </p>
          </div>

          <button
            onClick={() => navigate("/all-consultants")}
            className="text-indigo-600 text-sm hover:underline"
          >
            View all →
          </button>
        </div>

        {consultantsLoading ? (
          <p>Loading...</p>
        ) : consultants.length === 0 ? (
          <p className="text-gray-500">No consultants available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultants.map((c) => (
              <ConsultantCard key={c.id} consultant={c} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;