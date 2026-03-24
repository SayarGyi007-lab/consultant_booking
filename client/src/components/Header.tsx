import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/redux-slices/user-api";
import { clearUserInfo } from "../slices/redux-slices/auth";
import { LogIn, LogOut, Menu, UserPlus, X } from "lucide-react";
import Button from '../ui/Button';
import { useState } from "react";

function Header() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await logout(userInfo);
      dispatch(clearUserInfo());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="bg-black shadow-md">
      <nav className="flex justify-between items-center px-6 py-4 text-gray-50">

        <Link
          to={userInfo ? (userInfo.role === 'ADMIN' ? "/admin" : "/home") : "/"}
          className="text-2xl font-extrabold tracking-wide"
        >
          Consultify
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          {userInfo ? (
            userInfo.role === 'ADMIN' ? (
              <>
                <Link to="/admin/profile" className="hover:underline text-lg transition">
                  Profile
                </Link>
                <Button onClick={logoutHandler} variant="secondary" disabled={isLoading}>
                  Logout <LogOut size={18} />
                </Button>
              </>
            ) : (
              <>
                <Link to="/booking" className="hover:underline text-lg transition">Booking</Link>
                <Link to="/profile" className="hover:underline text-lg transition">Profile</Link>
                <Button onClick={logoutHandler} variant="secondary" disabled={isLoading}>
                  Logout <LogOut size={18} />
                </Button>
              </>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                <LogIn size={18} /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
              >
                <UserPlus size={18} /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-50 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700 px-6 pb-4 flex flex-col gap-4 text-gray-50">
          {userInfo ? (
            userInfo.role === 'ADMIN' ? (
              <>
                <Link to="/admin/profile" className="hover:underline text-base" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Button onClick={() => { logoutHandler(); setMenuOpen(false); }} variant="secondary" disabled={isLoading}>
                  Logout <LogOut size={18} />
                </Button>
              </>
            ) : (
              <>
                <Link to="/booking" className="hover:underline text-base" onClick={() => setMenuOpen(false)}>Booking</Link>
                <Link to="/profile" className="hover:underline text-base" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Button onClick={() => { logoutHandler(); setMenuOpen(false); }} variant="secondary" disabled={isLoading}>
                  Logout <LogOut size={18} />
                </Button>
              </>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={18} /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
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