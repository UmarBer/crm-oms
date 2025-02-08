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
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <Navbar />
        <div>
          {/* Routes */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/customers" element={<CustomerDashboard />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/new-order" element={<OrderForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/generate-sheet" element={<GenerateSheetForm />} />
            <Route path="/templates" element={<TemplateManager />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
