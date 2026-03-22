import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-4">
          <a href="/admin" className="block text-gray-700 hover:text-indigo-600">
            Dashboard
          </a>

          <a href="/admin/all-consultants" className="block text-gray-700 hover:text-indigo-600">
            Consultants
          </a>

          <a href="/admin/all-users" className="block text-gray-700 hover:text-indigo-600">
            Users
          </a>

          <a href="/admin/all-bookings" className="block text-gray-700 hover:text-indigo-600">
            Bookings
          </a>

          <a href="/admin/all-timeslots" className="block text-gray-700 hover:text-indigo-600">
            Time Slots
          </a>
        </nav>
      </aside>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout