import { lazy } from "react";
import PageLoader from "../ui/PageLoader";

export const Header = PageLoader(
    lazy(()=> import ('../components/Header'))
)

export const Main = PageLoader(
    lazy(()=> import ('../layout/Main'))
)

export const LandingPage = PageLoader(
    lazy(()=> import ('../pages/Landing'))
)

export const LoginPage = PageLoader(
    lazy(()=> import ('../pages/Login'))
)

export const RegisterPage = PageLoader(
    lazy(()=> import ('../pages/Register'))
)

export const Home = PageLoader(
    lazy(()=> import ('../pages/user/Home'))
)

export const Profile = PageLoader(
    lazy(()=> import ('../pages/Profile'))
)

export const Booking = PageLoader(
    lazy(()=> import ('../pages/user/Booking'))
)

export const MyBookings = PageLoader(
    lazy(()=> import ('../pages/user/BookingHistory'))
)

export const AllConsultants = PageLoader(
    lazy(()=> import ('../pages/user/AllConsultants'))
)

export const ConsultantInfo = PageLoader(
    lazy(()=> import ('../pages/user/ConsultantInfo'))
)

//admin

export const AdminLayout = PageLoader(
    lazy(()=> import ('../layout/admin/Main'))
)

export const Dashboard = PageLoader(
    lazy(()=> import ('../pages/admin/Dashboard'))
)

export const AddConsultant = PageLoader(
    lazy(()=> import ('../pages/admin/AddConsultant'))
)

export const AllBooking = PageLoader(
    lazy(()=> import ('../pages/admin/AllBooking'))
)

export const AllTimeslot = PageLoader(
    lazy(()=> import ('../pages/admin/AllTimeslot'))
)

export const AllConsultant = PageLoader(
    lazy(()=> import ('../pages/admin/AllConsultant'))
)

export const AllUser = PageLoader(
    lazy(()=> import ('../pages/admin/AllUser'))
)

export const AddTimeslot = PageLoader(
    lazy(()=> import ('../pages/admin/AddTimeslot'))
)

//components user
export const ChangePasswordCard = PageLoader(
    lazy(()=> import ('../components/user/ChangePassword'))
)

export const ConsultantCard = PageLoader(
    lazy(()=> import ('../components/user/ConsultantCard'))
)

export const ProfileBooking = PageLoader(
    lazy(()=> import ('../components/user/ProfileBooking'))
)

export const UpcomingBookings = PageLoader(
    lazy(()=> import ('../components/user/UpcomingBooking'))
)

//components admin
export const RecentBookingsTable = PageLoader(
    lazy(()=> import ('../components/admin/BookingTable'))
)

export const ConsultantTable = PageLoader(
    lazy(()=> import ('../components/admin/ConsultantTable'))
)

export const TimeSlotsTable = PageLoader(
    lazy(()=> import ('../components/admin/TimeSlotTable'))
)

export const UpdateConsultant = PageLoader(
    lazy(()=> import ('../components/admin/UpdateConsultant'))
)

export const UpdateTimeSlot = PageLoader(
    lazy(()=> import ('../components/admin/UpdateTimeSlot'))
)

export const UserTable = PageLoader(
    lazy(()=> import ('../components/admin/UserTable'))
)