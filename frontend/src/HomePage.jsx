import { useEffect, useState } from "react";

function HomePage() {
  const [otomotoData, setOtomotoData] = useState([]);
  const [autoscoutData, setAutoscoutData] = useState([]);
  const [otomotoLimit, setOtomotoLimit] = useState(10);
  const [autoscoutLimit, setAutoscoutLimit] = useState(10);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    price: "",
    year: "",
    mileage: ""
  });

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

  // Funkcja sprawdzająca, czy wartość filtra jest pusta
  const applyFilter = (car, filterKey) => {
    if (!filters[filterKey]) return true; // Jeśli filtr jest pusty, nie filtrujemy
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
      applyFilter(car, "power") // Zmieniamy "mileage" na "power" w przypadku Autoscout
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

        {/* Filtry dla Otomoto */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Marka"
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Model"
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Cena"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Rok"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Przebieg"
            name="mileage"
            value={filters.mileage}
            onChange={handleFilterChange}
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
              {filteredOtomotoData.map((car, index) => (
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

        {/* Filtry dla Autoscout */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Marka"
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Model"
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Cena"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Rok"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Moc"
            name="mileage"
            value={filters.mileage}
            onChange={handleFilterChange}
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
              {filteredAutoscoutData.map((car, index) => (
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
