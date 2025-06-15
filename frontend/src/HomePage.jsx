import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Pomocnicza funkcja fetch z timeoutem
function fetchWithTimeout(url, options = {}, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request timed out"));
    }, timeout);

    fetch(url, options)
      .then(res => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function HomePage() {
  const [otomotoData, setOtomotoData] = useState([]);
  const [autoscoutData, setAutoscoutData] = useState([]);
  const [otomotoLimit, setOtomotoLimit] = useState(10);
  const [autoscoutLimit, setAutoscoutLimit] = useState(10);

  const [otomotoFilters, setOtomotoFilters] = useState({
    make: "skoda",
    model: "octavia",
    price: "",
    year: "",
    mileage: ""
  });

  const [autoscoutFilters, setAutoscoutFilters] = useState({
    make: "skoda",
    model: "octavia",
    price: "",
    year: "",
    power: ""
  });

  const [selectedCars, setSelectedCars] = useState([]);
  const [otomotoLoading, setOtomotoLoading] = useState(true);
  const [autoscoutLoading, setAutoscoutLoading] = useState(true);
  const [otomotoError, setOtomotoError] = useState("");
  const [autoscoutError, setAutoscoutError] = useState("");
  const navigate = useNavigate();

  // 1️⃣ Pierwsze pobranie danych przy mountcie
  useEffect(() => {
    setOtomotoLoading(true);
    setAutoscoutLoading(true);
    setOtomotoError("");
    setAutoscoutError("");

    fetchWithTimeout(`http://localhost:8000/otomoto?limit=${otomotoLimit}`)
      .then(res => res.json())
      .then(data => setOtomotoData(data.data))
      .catch(err => setOtomotoError("Brak wyników (przekroczono czas oczekiwania)"))
      .finally(() => setOtomotoLoading(false));

    fetchWithTimeout(`http://localhost:8000/autoscout?limit=${autoscoutLimit}`)
      .then(res => res.json())
      .then(data => setAutoscoutData(data.data))
      .catch(err => setAutoscoutError("Brak wyników (przekroczono czas oczekiwania)"))
      .finally(() => setAutoscoutLoading(false));
  }, []);

  // 2️⃣ Fetch Otomoto przy zmianie limitu lub filtra
  useEffect(() => {
    const params = new URLSearchParams();
    if (otomotoLimit) params.append("limit", otomotoLimit);
    Object.entries(otomotoFilters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });

    setOtomotoLoading(true);
    setOtomotoError("");

    fetchWithTimeout(`http://localhost:8000/otomoto?${params.toString()}`)
      .then(res => res.json())
      .then(data => setOtomotoData(data.data))
      .catch(err => setOtomotoError("Brak wyników (przekroczono czas oczekiwania)"))
      .finally(() => setOtomotoLoading(false));
  }, [otomotoLimit, otomotoFilters]);

  // 3️⃣ Fetch Autoscout przy zmianie limitu lub filtra
  useEffect(() => {
    const params = new URLSearchParams();
    if (autoscoutLimit) params.append("limit", autoscoutLimit);
    Object.entries(autoscoutFilters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });

    setAutoscoutLoading(true);
    setAutoscoutError("");

    fetchWithTimeout(`http://localhost:8000/autoscout?${params.toString()}`)
      .then(res => res.json())
      .then(data => setAutoscoutData(data.data))
      .catch(err => setAutoscoutError("Brak wyników (przekroczono czas oczekiwania)"))
      .finally(() => setAutoscoutLoading(false));
  }, [autoscoutLimit, autoscoutFilters]);

  const handleSelectCar = (car, source) => {
    const carId = `${car.make};${car.model};${car.year};${car.price};${car.mileage}`;
    const exists = selectedCars.some(s => s.id === carId && s.source === source);
    if (exists) {
      setSelectedCars(selectedCars.filter(s => !(s.id === carId && s.source === source)));
    } else {
      setSelectedCars([...selectedCars, { id: carId, source }]);
    }
  };

  const isSelected = (car, source) => {
    const carId = `${car.make};${car.model};${car.year};${car.price};${car.mileage}`;
    return selectedCars.some(s => s.id === carId && s.source === source);
  };

  const handleCompare = () => {
    if (selectedCars.length < 2) {
      alert("Wybierz przynajmniej dwa auta do porównania!");
      return;
    }
    const query = selectedCars.map(c => `${c.source}:${c.id}`).join(",");
    navigate(`/compare?cars=${query}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800 drop-shadow-lg">
        🚗 CarMat 🚗
      </h1>

      <div className="grid gap-12">

        {/* OTOMOTO */}
        <section className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-700">Otomoto</h2>
            <input
              type="number"
              min="1"
              value={otomotoLimit}
              onChange={e => setOtomotoLimit(Number(e.target.value))}
              className="w-20 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {Object.keys(otomotoFilters).map(key => (
              <input
                key={key}
                type="text"
                name={key}
                placeholder={`Filtruj po ${key}`}
                value={otomotoFilters[key]}
                onChange={e => setOtomotoFilters({ ...otomotoFilters, [key]: e.target.value })}
                className="flex-1 min-w-[150px] p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-md">
            <table className="min-w-full bg-white text-gray-800">
              <thead className="bg-gradient-to-r from-purple-400 to-blue-400 text-white">
                <tr>
                  <th className="p-4 text-left">✔️</th>
                  <th className="p-4 text-left">Marka</th>
                  <th className="p-4 text-left">Model</th>
                  <th className="p-4 text-left">Cena</th>
                  <th className="p-4 text-left">Rok</th>
                  <th className="p-4 text-left">Przebieg</th>
                  <th className="p-4 text-left">Opinia</th>
                </tr>
              </thead>
              <tbody>
                {otomotoLoading ? (
                  <tr><td colSpan="7" className="p-4 text-center">Ładuję...</td></tr>
                ) : otomotoError ? (
                  <tr><td colSpan="7" className="p-4 text-center text-red-600">{otomotoError}</td></tr>
                ) : otomotoData.length === 0 ? (
                  <tr><td colSpan="7" className="p-4 text-center">Brak wyników.</td></tr>
                ) : (
                  otomotoData.map((car, i) => (
                    <tr key={i} className="hover:bg-purple-100/30 transition">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected(car, 'otomoto')}
                          onChange={() => handleSelectCar(car, 'otomoto')}
                          className="h-5 w-5 accent-blue-500"
                        />
                      </td>
                      <td className="p-4">{car.make}</td>
                      <td className="p-4">{car.model}</td>
                      <td className="p-4">{car.price} {car.currency}</td>
                      <td className="p-4">{car.year}</td>
                      <td className="p-4">{car.mileage} {car.mileage_unit}</td>
                      <td className="p-4">Lorem Ipsum</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* AUTOSCOUT */}
        <section className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-700">Autoscout</h2>
            <input
              type="number"
              min="1"
              value={autoscoutLimit}
              onChange={e => setAutoscoutLimit(Number(e.target.value))}
              className="w-20 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {Object.keys(autoscoutFilters).map(key => (
              <input
                key={key}
                type="text"
                name={key}
                placeholder={`Filtruj po ${key}`}
                value={autoscoutFilters[key]}
                onChange={e => setAutoscoutFilters({ ...autoscoutFilters, [key]: e.target.value })}
                className="flex-1 min-w-[150px] p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-md">
            <table className="min-w-full bg-white text-gray-800">
              <thead className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                <tr>
                  <th className="p-4 text-left">✔️</th>
                  <th className="p-4 text-left">Marka</th>
                  <th className="p-4 text-left">Model</th>
                  <th className="p-4 text-left">Rok</th>
                  <th className="p-4 text-left">Cena</th>
                  <th className="p-4 text-left">Przebieg</th>
                </tr>
              </thead>
              <tbody>
                {autoscoutLoading ? (
                  <tr><td colSpan="7" className="p-4 text-center">Ładuję...</td></tr>
                ) : autoscoutError ? (
                  <tr><td colSpan="7" className="p-4 text-center text-red-600">{autoscoutError}</td></tr>
                ) : autoscoutData.length === 0 ? (
                  <tr><td colSpan="7" className="p-4 text-center">Brak wyników.</td></tr>
                ) : (
                  autoscoutData.map((car, i) => (
                    <tr key={i} className="hover:bg-blue-100/30 transition">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected(car, 'autoscout')}
                          onChange={() => handleSelectCar(car, 'autoscout')}
                          className="h-5 w-5 accent-purple-500"
                        />
                      </td>
                      <td className="p-4">{car.make}</td>
                      <td className="p-4">{car.model}</td>
                      <td className="p-4">{car.year}</td>
                      <td className="p-4">{car.price} {car.currency}</td>
                      <td className="p-4">{car.power} {car.power_unit}</td>
                      <td className="p-4">Lorem Ipsum</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedCars.length >= 2 && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleCompare}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Porównaj wybrane auta
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
