// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link
} from 'react-router-dom';
import OrderForm from './Components/OrderForm';
import OrderList from './Components/OrderList';
import GenerateSheetButton from './Components/GenerateSheetButton';
import CustomerDashboard from './Components/CustomerDashboard';
import CustomerDetails from './Components/CustomerDetails';
import TemplateManager from './Components/TemplateManager';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen py-10 px-4">
        <Link to={'/'}>
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-800">
              Order Management System
            </h1>
          </header>
        </Link>

        {/* Navigation */}
        <nav className="flex justify-center space-x-8 mb-10">
          <NavLink
            to="/new-order"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                : 'text-blue-500 hover:underline'
            }
          >
            Add New Order
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                : 'text-blue-500 hover:underline'
            }
          >
            View Orders
          </NavLink>
          <NavLink
            to="/generate-sheet"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                : 'text-blue-500 hover:underline'
            }
          >
            Generate Production Sheet
          </NavLink>
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                : 'text-blue-500 hover:underline'
            }
          >
            View / Add Customers
          </NavLink>
          <NavLink
            to="/templates"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                : 'text-blue-500 hover:underline'
            }
          >
            Manage WhatsApp Templates
          </NavLink>
        </nav>

        {/* Routes */}
        <Routes>
          <Route
            path="/customers"
            element={
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-screen-lg mx-auto">
                <CustomerDashboard />
              </div>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-screen-lg mx-auto">
                <CustomerDetails />
              </div>
            }
          />
          <Route
            path="/new-order"
            element={
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                <OrderForm />
              </div>
            }
          />
          <Route
            path="/orders"
            element={
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
                <OrderList />
              </div>
            }
          />
          <Route
            path="/generate-sheet"
            element={
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <GenerateSheetButton />
              </div>
            }
          />
          <Route
            path="/templates"
            element={
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <TemplateManager />
              </div>
            }
          />
          <Route
            path="/"
            element={
              <div className="text-center">
                <p className="text-gray-600 text-lg">
                  Welcome to the Order Management System! Use the navigation
                  above to get started.
                </p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
