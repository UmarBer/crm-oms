// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderForm from './Components/OrderForm';
import OrderList from './Components/OrderList';
import GenerateSheetForm from './Components/GenerateSheetForm';
import CustomerDashboard from './Components/CustomerDashboard';
import CustomerDetails from './Components/CustomerDetails';
import TemplateManager from './Components/TemplateManager';
import LandingPage from './Components/LandingPage';
import Navbar from './Components/Navbar';
import SignUpPage from './Components/SignUpPage';
import SignInPage from './Components/SignInPage';
import Footer from './Components/Footer';
import PrivateRoute from './Components/PrivateRoute';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-100">
      <Router>
        <Navbar />
        <div>
          {/* Routes */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/customers" element={<CustomerDashboard />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
              <Route path="/new-order" element={<OrderForm />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/generate-sheet" element={<GenerateSheetForm />} />
              <Route path="/templates" element={<TemplateManager />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
