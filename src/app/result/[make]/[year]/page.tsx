'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ResultPage() {
  const { make, year } = useParams(); // Extract dynamic params from URL
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (make && year) {
      fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          setModels(data.Results || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching models:', err);
          setLoading(false);
        });
    }
  }, [make, year]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600">
            Results for {make} {year}
          </h1>
        </header>

        {loading ? (
          <div className="text-center text-xl font-semibold text-gray-500">
            Loading...
          </div>
        ) : models.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model, index) => (
              <li
                key={index}
                className="border rounded-lg shadow p-4 hover:shadow-lg transition duration-300 bg-gray-50"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {model.Model_Name}
                </h2>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-xl font-semibold text-gray-500">
            No models found for this make and year.
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
