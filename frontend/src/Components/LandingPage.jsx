import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  bg-gradient-to-r from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Miro OMS</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <button
                  onClick={() => navigate('/features')}
                  className="text-gray-600 hover:text-blue-600 transition duration-200"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-gray-600 hover:text-blue-600 transition duration-200"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-gray-600 hover:text-blue-600 transition duration-200"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                >
                  Get Started
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="text-center py-20 bg-white">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Revolutionize Your Wholesale Orders
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            A simple yet powerful CRM and OMS designed to streamline your
            workflow.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Try It Free
          </button>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-6">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h4 className="text-xl font-bold text-blue-600 mb-4">
                  WhatsApp Integration
                </h4>
                <p className="text-gray-600">
                  Send messages, automate updates, and maintain close contact
                  with your customers.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h4 className="text-xl font-bold text-blue-600 mb-4">
                  Google Sheets Export
                </h4>
                <p className="text-gray-600">
                  Generate production sheets effortlessly and share them with
                  your team.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h4 className="text-xl font-bold text-blue-600 mb-4">
                  Customer Analytics
                </h4>
                <p className="text-gray-600">
                  Gain insights into your customers and optimize your sales
                  strategy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="text-center py-20 bg-blue-600 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Simplify Your Workflow?
          </h3>
          <p className="text-lg mb-6">
            Start using Miro OMS today and experience the difference.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition duration-200"
          >
            Get Started Now
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Miro OMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
