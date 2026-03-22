import { Users, UserCheck, CalendarCheck, ClockPlus } from "lucide-react";

export const DashboardStats = (
  totalUsers: number,
  totalConsultants: number,
  totalBookings: number,
  totalTimeSlots: number
) => {
  return [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users
    },
    {
      title: "Consultants",
      value: totalConsultants,
      icon: UserCheck
    },
    {
      title: "Bookings",
      value: totalBookings,
      icon: CalendarCheck
    },
    {
      title: "Time Slots",
      value: totalTimeSlots,
      icon: ClockPlus
    }
  ];
};