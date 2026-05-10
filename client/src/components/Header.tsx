import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/redux-slices/user-api";
import { clearUserInfo } from "../slices/redux-slices/auth";
import { LogIn, LogOut, Menu, UserPlus, X } from "lucide-react";
import Button from "../ui/components/Button";
import { useState } from "react";

function Header() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await logout(userInfo).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(clearUserInfo());
      navigate("/");
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-indigo-600 font-semibold underline"
      : "hover:underline text-lg transition";

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-indigo-600 font-semibold text-base"
      : "hover:text-indigo-600 text-base transition";

  return (
    <header className="bg-white shadow-md text-gray-700">
      <nav className="flex justify-between items-center px-6 py-4">
        <Link
          to={userInfo ? (userInfo.role === "ADMIN" ? "/admin" : "/home") : "/"}
          className="text-3xl text-indigo-600 font-extrabold tracking-wide"
        >
          Consultify
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          {userInfo ? (
            userInfo.role === "ADMIN" ? (
              <>
                <NavLink to="/admin/profile" className={navLinkClass}>
                  Profile
                </NavLink>

                <Button
                  onClick={logoutHandler}
                  variant="secondary"
                  disabled={isLoading}
                >
                  Logout <LogOut size={18} />
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/home" className={navLinkClass}>
                  Home
                </NavLink>

                <NavLink to="/all-consultants" className={navLinkClass}>
                  Consultants
                </NavLink>

                <NavLink to="/my-bookings" className={navLinkClass}>
                  Booking
                </NavLink>

                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>

                <Button
                  onClick={logoutHandler}
                  variant="secondary"
                  disabled={isLoading}
                >
                  Logout <LogOut size={18} />
                </Button>
              </>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gray-700 text-white hover:bg-gray-600 px-4 py-2 rounded-lg transition"
              >
                <LogIn size={18} /> Login
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-500 transition"
              >
                <UserPlus size={18} /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-4 text-gray-700 shadow-md">
          {userInfo ? (
            userInfo.role === "ADMIN" ? (
              <>
                <NavLink
                  to="/admin/profile"
                  className={mobileNavLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </NavLink>

                <Button
                  onClick={() => {
                    logoutHandler();
                    setMenuOpen(false);
                  }}
                  variant="secondary"
                  disabled={isLoading}
                >
                  Logout <LogOut size={18} />
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  to="/home"
                  className={mobileNavLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </NavLink>

                <NavLink
                  to="/all-consultants"
                  className={mobileNavLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Consultants
                </NavLink>

                <NavLink
                  to="/my-bookings"
                  className={mobileNavLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Booking
                </NavLink>

                <NavLink
                  to="/profile"
                  className={mobileNavLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </NavLink>

                <Button
                  onClick={() => {
                    logoutHandler();
                    setMenuOpen(false);
                  }}
                  variant="secondary"
                  disabled={isLoading}
                >
                  Logout <LogOut size={18} />
                </Button>
              </>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={18} /> Login
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-500 transition"
                onClick={() => setMenuOpen(false)}
              >
                <UserPlus size={18} /> Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;