import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ComparePage() {
  const [cars, setCars] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const ids = queryParams.get("ids");

    if (ids) {
      fetch(`/api/compare?ids=${ids}`)
        .then((res) => res.json())
        .then((data) => setCars(data));
    }
  }, [location]);

  if (cars.length === 0) {
    return <div>Ładowanie aut do porównania...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Porównanie samochodów 🚗🚙</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cars.map((car, idx) => (
          <div key={idx} className="border rounded p-4 shadow">
            <p><strong>Marka:</strong> {car.brand}</p>
            <p><strong>Model:</strong> {car.model}</p>
            <p><strong>Cena:</strong> {car.price} PLN</p>
            <p><strong>Rok:</strong> {car.year}</p>
            <p><strong>Przebieg:</strong> {car.mileage} km</p>
            <p><strong>Źródło:</strong> {car.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
