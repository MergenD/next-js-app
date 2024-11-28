'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type VehicleModel = {
  ModelName: string;
  ModelID: string;
};

export default function ResultPage() {
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { make, year } = router.query;

  useEffect(() => {
    if (make && year) {
      async function fetchModels() {
        const response = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${make}/modelyear/${year}?format=json`
        );
        const data = await response.json();
        if (data.Results) {
          setModels(data.Results);
        } else {
          setError('No models found for the selected make and year.');
        }
      }

      fetchModels();
    }
  }, [make, year]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl mb-6">
        Vehicle Models for {make} - {year}
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        {models.map((model) => (
          <div key={model.ModelID} className="border p-4 rounded">
            <p>{model.ModelName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
