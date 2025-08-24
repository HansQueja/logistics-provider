// src/app/page.js

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to the Dashboard
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Explore the available sections of your logistics dashboard.
      </p>

      {/* Exploratory Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Assigned Drivers
          </h2>
          <p className="text-sm text-gray-500">
            View drivers assigned per logistic provider
          </p>
        </div>

        <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Driver Shifts
          </h2>
          <p className="text-sm text-gray-500">
            Manage and track driver shift schedules
          </p>
        </div>

        <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Vehicle Usage
          </h2>
          <p className="text-sm text-gray-500">
            Monitor and analyze vehicle utilization
          </p>
        </div>

        <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Delivery Heatmap
          </h2>
          <p className="text-sm text-gray-500">
            Visualize delivery density across locations
          </p>
        </div>
      </div>
    </div>
  );
}
