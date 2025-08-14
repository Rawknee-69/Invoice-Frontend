import React from "react";
import { ModeToggle } from "../index";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
              <ModeToggle />
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Invoice Management System
        </h1>

        <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Welcome to Your Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                Create Invoice
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Generate professional invoices for your clients
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                Manage Clients
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Keep track of all your client information
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">
                View Reports
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Analyze your business performance
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 read-the-docs text-center">
            Your complete invoice management solution
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
