import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function ComparePage() {
  const [searchParams] = useSearchParams();
  const [carsData, setCarsData] = useState([]);

  useEffect(() => {
    const carsQuery = searchParams.get("cars");
    if (!carsQuery) return;

    const carsList = carsQuery.split(",").map((entry) => {
      const [source, id] = entry.split(":");
      return { source, id };
    });

    async function fetchCarDetails() {
      const fetchedCars = await Promise.all(
        carsList.map(async ({ source, id }) => {
          const [make, model, year, price] = id.split("-");
          let url = `http://localhost:8000/${source}?make=${make}&model=${model}&year=${year}&price=${price}`;
          const res = await fetch(url);
          const data = await res.json();
          return { source, ...data.data[0] };
        })
      );

      setCarsData(fetchedCars);
    }

    fetchCarDetails();
  }, [searchParams]);

  if (carsData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Ładowanie danych samochodów...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100 p-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800">Porównanie samochodów 🚗🚗</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {carsData.map((car, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">{car.make} {car.model}</h2>
            <ul className="text-lg space-y-4">
              <li><strong>Marka:</strong> {car.make}</li>
              <li><strong>Model:</strong> {car.model}</li>
              <li><strong>Rok produkcji:</strong> {car.year}</li>
              <li><strong>Cena:</strong> {car.price} {car.currency}</li>
              {car.mileage && <li><strong>Przebieg:</strong> {car.mileage} {car.mileage_unit}</li>}
              {car.power && <li><strong>Moc:</strong> {car.power} {car.power_unit}</li>}
              <li><strong>Źródło:</strong> {car.source === "otomoto" ? "Otomoto" : "Autoscout"}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComparePage;
