import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [otomotoData, setOtomotoData] = useState([]);
  const [autoscoutData, setAutoscoutData] = useState([]);
  const [otomotoLimit, setOtomotoLimit] = useState(10);
  const [autoscoutLimit, setAutoscoutLimit] = useState(10);
  const [selectedCars, setSelectedCars] = useState([]); // <-- nowy
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    price: "",
    year: "",
    mileage: ""
  });

  const navigate = useNavigate(); // <-- do nawigacji

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSelectCar = (car) => {
    const carId = `${car.brand}-${car.model}-${car.year}-${car.price}`; // generujemy unikalny ID
    if (selectedCars.includes(carId)) {
      setSelectedCars(selectedCars.filter(id => id !== carId));
    } else {
      setSelectedCars([...selectedCars, carId]);
    }
  };

  const handleCompare = () => {
    if (selectedCars.length >= 2) {
      navigate(`/compare?ids=${selectedCars.join(",")}`);
    } else {
      alert("Wybierz przynajmniej dwa auta do porównania!");
    }
  };

  const applyFilter = (car, filterKey) => {
    if (!filters[filterKey]) return true;
    return car[filterKey]?.toString().toLowerCase().includes(filters[filterKey].toLowerCase());
  };

  const filteredOtomotoData = otomotoData.filter((car) => {
    return (
      applyFilter(car, "brand") &&
      applyFilter(car, "model") &&
      applyFilter(car, "price") &&
      applyFilter(car, "year") &&
      applyFilter(car, "mileage")
    );
  });

  const filteredAutoscoutData = autoscoutData.filter((car) => {
    return (
      applyFilter(car, "brand") &&
      applyFilter(car, "model") &&
      applyFilter(car, "price") &&
      applyFilter(car, "year") &&
      applyFilter(car, "power")
    );
  });

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

        {/* Filtry */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* ... inputy filtrów (bez zmian) */}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">✔️</th> {/* Nowa kolumna */}
                <th className="p-3">Marka</th>
                <th className="p-3">Model</th>
                <th className="p-3">Cena</th>
                <th className="p-3">Rok</th>
                <th className="p-3">Przebieg</th>
              </tr>
            </thead>
            <tbody>
              {filteredOtomotoData.map((car, index) => {
                const carId = `${car.brand}-${car.model}-${car.year}-${car.price}`;
                return (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedCars.includes(carId)}
                        onChange={() => handleSelectCar(car)}
                      />
                    </td>
                    <td className="p-3">{car.brand}</td>
                    <td className="p-3">{car.model}</td>
                    <td className="p-3">{car.price} {car.currency}</td>
                    <td className="p-3">{car.year}</td>
                    <td className="p-3">{car.mileage} {car.mileage_unit}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Autoscout */}
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
                <th className="p-3">✔️</th>
                <th className="p-3">Marka</th>
                <th className="p-3">Model</th>
                <th className="p-3">Rok</th>
                <th className="p-3">Cena</th>
                <th className="p-3">Moc</th>
              </tr>
            </thead>
            <tbody>
              {filteredAutoscoutData.map((car, index) => {
                const carId = `${car.brand}-${car.model}-${car.year}-${car.price}`;
                return (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedCars.includes(carId)}
                        onChange={() => handleSelectCar(car)}
                      />
                    </td>
                    <td className="p-3">{car.brand}</td>
                    <td className="p-3">{car.model}</td>
                    <td className="p-3">{car.year}</td>
                    <td className="p-3">{car.price} {car.currency}</td>
                    <td className="p-3">{car.power} {car.power_unit}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* PRZYCISK Porównaj */}
      {selectedCars.length >= 2 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleCompare}
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-700"
          >
            Porównaj wybrane auta
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
