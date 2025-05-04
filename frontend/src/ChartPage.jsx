import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

function ChartPage() {
  const [otomotoData, setOtomotoData] = useState([]);
  const [autoscoutData, setAutoscoutData] = useState([]);

  const [otomotoFilters, setOtomotoFilters] = useState({
    brand: "",
    model: "",
    price: "",
    year: "",
    mileage: "",
  });

  const [autoscoutFilters, setAutoscoutFilters] = useState({
    brand: "",
    model: "",
    price: "",
    year: "",
    mileage: "",
  });

  // Nowe stany do zwijania/rozwijania sekcji
  const [isOtomotoVisible, setIsOtomotoVisible] = useState(true);
  const [isAutoscoutVisible, setIsAutoscoutVisible] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/otomoto?limit=100`)
      .then((res) => res.json())
      .then((data) => setOtomotoData(data.data))
      .catch((err) => console.error(err));

    fetch(`http://localhost:8000/autoscout?limit=100`)
      .then((res) => res.json())
      .then((data) => setAutoscoutData(data.data))
      .catch((err) => console.error(err));
  }, []);

  const applyFilters = (data, filters) => {
    return data.filter(car => {
      const brandMatch = filters.brand ? car.make?.toLowerCase().includes(filters.brand.toLowerCase()) : true;
      const modelMatch = filters.model ? car.model?.toLowerCase().includes(filters.model.toLowerCase()) : true;
      const priceMatch = filters.price ? car.price <= parseInt(filters.price) : true;
      const yearMatch = filters.year ? car.year?.toString() === filters.year.toString() : true;
      const mileageMatch = filters.mileage ? car.mileage <= parseInt(filters.mileage) : true;
      return brandMatch && modelMatch && priceMatch && yearMatch && mileageMatch;
    });
  };

  const filteredOtomoto = applyFilters(otomotoData, otomotoFilters);
  const filteredAutoscout = applyFilters(autoscoutData, autoscoutFilters);

  const prepareChartData = (data) =>
    data.map((car) => ({
      name: `${car.make || "?"} ${car.model || "?"} ${car.year || "?"}`,
      price: car.price
    }));

  const findMaxPrice = (data) => {
    if (data.length === 0) return 100000;
    return Math.max(...data.map(car => car.price || 0)) * 1.1;
  };

  return (
    <div className="p-8 bg-gradient-to-br from-purple-100 to-blue-100 min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">📊 Analiza Cen Samochodów</h1>

      {/* Sekcja Otomoto */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-semibold text-blue-700 text-center flex-1">Otomoto 📈</h2>
          <button 
            onClick={() => setIsOtomotoVisible(!isOtomotoVisible)}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            {isOtomotoVisible ? "Ukryj" : "Pokaż"}
          </button>
        </div>

        {isOtomotoVisible && (
          <>
            {/* Filtry Otomoto */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <input type="text" placeholder="Marka" value={otomotoFilters.brand} onChange={(e) => setOtomotoFilters({ ...otomotoFilters, brand: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="text" placeholder="Model" value={otomotoFilters.model} onChange={(e) => setOtomotoFilters({ ...otomotoFilters, model: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="number" placeholder="Max cena" value={otomotoFilters.price} onChange={(e) => setOtomotoFilters({ ...otomotoFilters, price: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="number" placeholder="Rok" value={otomotoFilters.year} onChange={(e) => setOtomotoFilters({ ...otomotoFilters, year: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="number" placeholder="Max przebieg" value={otomotoFilters.mileage} onChange={(e) => setOtomotoFilters({ ...otomotoFilters, mileage: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            {/* Wykres Otomoto */}
            <div className="w-full h-[500px] bg-white rounded-xl shadow p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareChartData(filteredOtomoto)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={120} />
                  <YAxis domain={[0, findMaxPrice(filteredOtomoto)]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </section>

      {/* Sekcja Autoscout */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-semibold text-green-700 text-center flex-1">Autoscout 📈</h2>
          <button 
            onClick={() => setIsAutoscoutVisible(!isAutoscoutVisible)}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
          >
            {isAutoscoutVisible ? "Ukryj" : "Pokaż"}
          </button>
        </div>

        {isAutoscoutVisible && (
          <>
            {/* Filtry Autoscout */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <input type="text" placeholder="Marka" value={autoscoutFilters.brand} onChange={(e) => setAutoscoutFilters({ ...autoscoutFilters, brand: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="text" placeholder="Model" value={autoscoutFilters.model} onChange={(e) => setAutoscoutFilters({ ...autoscoutFilters, model: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="number" placeholder="Max cena" value={autoscoutFilters.price} onChange={(e) => setAutoscoutFilters({ ...autoscoutFilters, price: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="number" placeholder="Rok" value={autoscoutFilters.year} onChange={(e) => setAutoscoutFilters({ ...autoscoutFilters, year: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="number" placeholder="Max przebieg" value={autoscoutFilters.mileage} onChange={(e) => setAutoscoutFilters({ ...autoscoutFilters, mileage: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>

            {/* Wykres Autoscout */}
            <div className="w-full h-[500px] bg-white rounded-xl shadow p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareChartData(filteredAutoscout)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={120} />
                  <YAxis domain={[0, findMaxPrice(filteredAutoscout)]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default ChartPage;
