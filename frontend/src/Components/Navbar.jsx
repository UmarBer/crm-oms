import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    isActive
      ? 'text-blue-700 font-bold border-b-2 border-blue-700'
      : 'text-black-500 hover:underline';

  return (
    <nav className="bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-black-700">My CRM</div>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
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
              className="bg-blue-600 text-white px-4 py-2 font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-200"
            >
              Get Started
            </button>
            {/* </NavLink> */}
            <GoogleLoginButton />
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
            <NavLink
              to="/landing"
              className={navLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              <button
                onClick={() => navigate('/signup')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
              >
                Get Started
              </button>
            </NavLink>
            <GoogleLoginButton />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
