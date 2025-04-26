import { useEffect, useState } from "react";

function App() {
  const [otomotoData, setOtomotoData] = useState([]);
  const [autoscoutData, setAutoscoutData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/otomoto")
      .then((res) => res.json())
      .then((data) => setOtomotoData(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:8000/autoscout")
      .then((res) => res.json())
      .then((data) => setAutoscoutData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Samochody 🚗</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Otomoto</h2>
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
                  <td className="p-3">{car.make}</td>
                  <td className="p-3">{car.model}</td>
                  <td className="p-3">
                    {car.price} {car.currency}
                  </td>
                  <td className="p-3">{car.year}</td>
                  <td className="p-3">{car.mileage} {car.mileage_unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Autoscout</h2>
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
                  <td className="p-3">{car.make}</td>
                  <td className="p-3">{car.model}</td>
                  <td className="p-3">{car.year}</td>
                  <td className="p-3">
                    {car.price} {car.currency}
                  </td>
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

export default App;
