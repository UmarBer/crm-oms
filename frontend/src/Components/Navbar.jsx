import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const navLinkClasses = ({ isActive }) =>
    isActive
      ? 'text-blue-700 font-bold '
      : 'text-black-700 font-semibold py-4 hover:underline';

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-100 via-blue to-blue-200 shadow-md ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center  py-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-black-700">My CRM</div>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <NavLink to="/new-order" className={navLinkClasses}>
              Add New Order
            </NavLink>
            <NavLink to="/orders" className={navLinkClasses}>
              View Orders
            </NavLink>
            <NavLink to="/generate-sheet" className={navLinkClasses}>
              Generate Production Sheet
            </NavLink>
            <NavLink to="/customers" className={navLinkClasses}>
              View / Add Customers
            </NavLink>
            <NavLink to="/templates" className={navLinkClasses}>
              Manage WhatsApp Templates
            </NavLink>
            {/* <NavLink className={navLinkClasses}> */}
            <button
              onClick={() => navigate('/signup')}
              className={
                currentUser
                  ? 'hidden'
                  : 'text-white font-bold bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800  rounded-lg text-md px-5 py-2 text-center '
              }
            >
              Get Started
            </button>
            <button
              onClick={handleSignout}
              className={
                currentUser
                  ? 'text-white hover:text-white border bg-red-300 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-md px-5  text-center h-8  '
                  : 'hidden'
              }
            >
              Sign Out
            </button>
            {/* </NavLink> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center text-blue-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col space-y-4 px-4 py-4">
            <NavLink
              to="/new-order"
              className={navLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              Add New Order
            </NavLink>
            <NavLink
              to="/orders"
              className={navLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              View Orders
            </NavLink>
            <NavLink
              to="/generate-sheet"
              className={navLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              Generate Production Sheet
            </NavLink>
            <NavLink
              to="/customers"
              className={navLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              View / Add Customers
            </NavLink>
            <NavLink
              to="/templates"
              className={navLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              Manage WhatsApp Templates
            </NavLink>

            <button
              onClick={() => navigate('/signup')}
              className={
                currentUser
                  ? 'hidden'
                  : 'text-white font-bold bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800  rounded-lg text-md px-5 py-2 text-center '
              }
            >
              Get Started
            </button>

            <button
              onClick={handleSignout}
              className={
                currentUser
                  ? 'text-white hover:text-white border bg-red-300 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-md px-5  text-center h-8  '
                  : 'hidden'
              }
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
