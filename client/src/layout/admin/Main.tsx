import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/all-consultants", label: "Consultants" },
    { href: "/admin/all-users", label: "Users" },
    { href: "/admin/all-bookings", label: "Bookings" },
    { href: "/admin/all-timeslots", label: "Time Slots" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-md p-6 z-30 transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:shrink-0
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-gray-700 hover:text-indigo-600 transition"
              onClick={() => setSidebarOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-indigo-600"
          >
            <Menu size={22} />
          </button>
          <span className="font-semibold text-gray-800">Admin Panel</span>
        </div>

        <main className="flex-1 p-4 lg:p-8 overflow-x-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;