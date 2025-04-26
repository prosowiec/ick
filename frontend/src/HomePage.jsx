import { useEffect, useState } from "react";

function HomePage() {
  const [otomotoData, setOtomotoData] = useState([]);
  const [autoscoutData, setAutoscoutData] = useState([]);
  const [otomotoLimit, setOtomotoLimit] = useState(10);
  const [autoscoutLimit, setAutoscoutLimit] = useState(10);

  useEffect(() => {
    fetch(`http://localhost:8000/otomoto?limit=${otomotoLimit}`)
      .then((res) => res.json())
      .then((data) => setOtomotoData(data.data))
      .catch((err) => console.error(err));
  }, [otomotoLimit]);

  useEffect(() => {
    fetch(`http://localhost:8000/autoscout?limit=${autoscoutLimit}`)
      .then((res) => res.json())
      .then((data) => setAutoscoutData(data.data))
      .catch((err) => console.error(err));
  }, [autoscoutLimit]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">Samochody 🚗</h1>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Otomoto</h2>
          <input
            type="number"
            min="1"
            value={otomotoLimit}
            onChange={(e) => setOtomotoLimit(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Marka</th>
                <th className="p-3">Model</th>
                <th className="p-3">Cena</th>
                <th className="p-3">Rok</th>
                <th className="p-3">Przebieg</th>
              </tr>
            </thead>
            <tbody>
              {otomotoData.map((car, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">{car.brand}</td>
                  <td className="p-3">{car.model}</td>
                  <td className="p-3">{car.price} {car.currency}</td>
                  <td className="p-3">{car.year}</td>
                  <td className="p-3">{car.mileage} {car.mileage_unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Autoscout</h2>
          <input
            type="number"
            min="1"
            value={autoscoutLimit}
            onChange={(e) => setAutoscoutLimit(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Marka</th>
                <th className="p-3">Model</th>
                <th className="p-3">Rok</th>
                <th className="p-3">Cena</th>
                <th className="p-3">Moc</th>
              </tr>
            </thead>
            <tbody>
              {autoscoutData.map((car, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">{car.brand}</td>
                  <td className="p-3">{car.model}</td>
                  <td className="p-3">{car.year}</td>
                  <td className="p-3">{car.price} {car.currency}</td>
                  <td className="p-3">{car.power} {car.power_unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
