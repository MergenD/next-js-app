'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Make = {
  MakeID: string;
  MakeName: string;
};

export default function Home() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [years, setYears] = useState<number[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  // Fetch vehicle makes from the API
  useEffect(() => {
    async function fetchMakes() {
      const response = await fetch(
        'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
      );
      const data = await response.json();
      setMakes(data.Results || []);
    }
    fetchMakes();
  }, []);

  // Generate years dynamically
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray: number[] = [];
    for (let year = 2015; year <= currentYear; year++) {
      yearsArray.push(year);
    }
    setYears(yearsArray);
  }, []);

  // Enable/Disable button
  useEffect(() => {
    setIsButtonDisabled(!(selectedMake && selectedYear));
  }, [selectedMake, selectedYear]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
          Car Dealer Filter
        </h1>

        <div className="mb-6">
          <label htmlFor="make" className="block text-lg font-medium mb-2">
            Vehicle Make
          </label>
          <select
            id="make"
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
          >
            <option value="" disabled>
              Select a make
            </option>
            {makes.map((make) => (
              <option key={make.MakeID} value={make.MakeName}>
                {make.MakeName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="year" className="block text-lg font-medium mb-2">
            Model Year
          </label>
          <select
            id="year"
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="" disabled>
              Select a year
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <Link href={`/result/${selectedMake}/${selectedYear}`} passHref>
          <button
            disabled={isButtonDisabled}
            className={`w-full px-4 py-2 text-white font-bold rounded-md transition ${
              isButtonDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
}
