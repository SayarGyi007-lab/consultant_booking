import { Users, UserCheck, CalendarCheck, Plus, ArrowRight } from "lucide-react";
import Button from "../../ui/Button";
import AnimatedCard from "../../ui/AnimateCard";
import FeatureCard from "../../ui/FeatureCard";
import { Link, useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers";
import { DashboardStats } from "../../utils/dashboard-stats";
import { useConsultants } from "../../hooks/useConsultants";
import { useBookings } from "../../hooks/useBookings";
import { useTimeSlots } from "../../hooks/useTimeSlots";
import RecentBookingsTable from "../../components/admin/BookingTable";

const Dashboard = () => {

  const navigate = useNavigate()
  const { usersPagination, isLoading: usersLoading } = useUsers({ limit: 10 });
  const { consultantsPagination, isLoading: consultantsLoading } = useConsultants({ limit: 10 });
  const { bookings, bookingsPagination, isLoading: bookingsLoading } = useBookings({ limit: 10 })
  const { timeslotsPagination, isLoading: timeslotsLoading } = useTimeSlots({ limit: 10 })

  const isLoading = usersLoading || consultantsLoading || bookingsLoading || timeslotsLoading;

  // console.log(timeslotsPagination?.total);

  const stats = DashboardStats(
    usersPagination?.total ?? 0,
    consultantsPagination?.total ?? 0,   
    bookingsPagination?.total ?? 0, 
    timeslotsPagination?.total ?? 0 
  );

  const submitConsultant = () => {
    navigate('/admin/create-consultant')
  }

  const submitTimeSlot = () =>{
    navigate('/admin/create-timeslot')
  }

  return (
    <div className="p-8 space-y-10 bg-gray-50 min-h-screen ">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">
          Manage your booking platform
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <AnimatedCard
              key={stat.title}
              className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>

                <h2 className="text-2xl font-bold">
                  {isLoading ? "..." : stat.value}
                </h2>
              </div>

              <Icon className="w-8 h-8 text-indigo-600" />
            </AnimatedCard>
          );
        })}
      </div>

      {/* ADMIN FEATURES */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Platform Management</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={Users}
            title="Manage Users"
            description="Manage all registered users."
            to= "/admin/all-users"
          />

          <FeatureCard
            icon={UserCheck}
            title="Consultants"
            description="Manage consultants."
            to= "/admin/all-consultants"
          />

          <FeatureCard
            icon={CalendarCheck}
            title="Bookings"
            description="Monitor and manage all bookings."
            to="/admin/all-bookings"
          />

          <FeatureCard
            icon={Users}
            title="Manage Timeslots"
            description="Manage all timeslots."
            to= "/admin/all-timeslots"
          />
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        <div className="flex gap-4">
          <Button
            className="flex items-center gap-2 px-4 py-2"
            variant="common"
            onClick={submitConsultant}
          >
            <Plus size={18} />
            Add Consultant
          </Button>

          <Button
            className="flex items-center gap-2 px-4 py-2"
            variant="common"
            onClick={submitTimeSlot}
          >
            <Plus size={18} />
            Add TimeSlot
          </Button>

          {/* <Button
            className="flex items-center gap-2 px-4 py-2"
            variant="uncommon"
          >
            <Settings size={18} />
            Manage Settings
          </Button> */}
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <div >
        <RecentBookingsTable
          bookings={bookings.slice(0, 5)}
          title="Recent Bookings"
          page={1}
          limit={5}
        />
        <Link
          to="/admin/all-bookings"
          className="mt-4 flex justify-end items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          See More <ArrowRight size={16} />
        </Link>
      </div>

    </div>
  );
}

export default Dashboard