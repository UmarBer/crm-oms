import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-32 bg-white">
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
        <section className="py-32 bg-gradient-to-b from-blue-50 to-white">
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
        <section className="text-center py-32 bg-blue-600 text-white mb-0">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Simplify Your Workflow?
          </h3>
          <p className="text-lg mb-6 mx-1">
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
      <footer className="bg-gray-800 text-white py-24 mt-0">
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
