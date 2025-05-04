import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

function ChartPage() {
  const [otomotoData, setOtomotoData] = useState([]);
  const [autoscoutData, setAutoscoutData] = useState([]);

  const [otomotoFilters, setOtomotoFilters] = useState({
    brand: "skoda",
    model: "",
    price: "",
    year: "",
    mileage: "",
  });

  const [autoscoutFilters, setAutoscoutFilters] = useState({
    brand: "skoda",
    model: "",
    price: "",
    year: "",
    mileage: "",
  });

  const [isOtomotoVisible, setIsOtomotoVisible] = useState(true);
  const [isAutoscoutVisible, setIsAutoscoutVisible] = useState(true);

  useEffect(() => {
    fetchData();
  }, [otomotoFilters, autoscoutFilters]);

  const buildQuery = (baseUrl, filters) => {
    const params = new URLSearchParams();
    if (filters.brand) params.append("make", filters.brand);
    if (filters.model) params.append("model", filters.model);
    if (filters.price) params.append("price", filters.price);
    if (filters.year) params.append("year", filters.year);
    return `${baseUrl}?${params.toString()}`;
  };

  const fetchData = async () => {
    try {
      const res1 = await fetch(buildQuery("http://localhost:8000/otomoto/avg_by_year", otomotoFilters));
      const data1 = await res1.json();
      const sortedOtomotoData = data1.data.sort((a, b) => a.year - b.year);  // Sortowanie po roku
      setOtomotoData(sortedOtomotoData);

      const res2 = await fetch(buildQuery("http://localhost:8000/autoscout/avg_by_year", autoscoutFilters));
      const data2 = await res2.json();
      const sortedAutoscoutData = data2.data.sort((a, b) => a.year - b.year);  // Sortowanie po roku
      setAutoscoutData(sortedAutoscoutData);
    } catch (err) {
      console.error(err);
    }
  };

  const findMaxPrice = (data) => {
    if (data.length === 0) return 100000;
    return Math.max(...data.map(car => car.avg_price || 0)) * 1.1;
  };

  return (
    <div className="p-8 bg-gradient-to-br from-purple-100 to-blue-100 min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">📊 Analiza Cen Samochodów</h1>

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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <input type="text" placeholder="Marka" value={otomotoFilters.brand} onChange={(e) => setOtomotoFilters({ ...otomotoFilters, brand: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="text" placeholder="Model" value={otomotoFilters.model} onChange={(e) => setOtomotoFilters({ ...otomotoFilters, model: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="number" placeholder="Max cena" value={otomotoFilters.price} onChange={(e) => setOtomotoFilters({ ...otomotoFilters, price: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="number" placeholder="Rok" value={otomotoFilters.year} onChange={(e) => setOtomotoFilters({ ...otomotoFilters, year: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="number" placeholder="Max przebieg" value={otomotoFilters.mileage} disabled className="border p-2 rounded shadow bg-gray-100" />
            </div>

            <div className="w-full h-[500px] bg-white rounded-xl shadow p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={otomotoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, findMaxPrice(otomotoData)]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avg_price" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </section>

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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <input type="text" placeholder="Marka" value={autoscoutFilters.brand} onChange={(e) => setAutoscoutFilters({ ...autoscoutFilters, brand: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="text" placeholder="Model" value={autoscoutFilters.model} onChange={(e) => setAutoscoutFilters({ ...autoscoutFilters, model: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="number" placeholder="Max cena" value={autoscoutFilters.price} onChange={(e) => setAutoscoutFilters({ ...autoscoutFilters, price: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="number" placeholder="Rok" value={autoscoutFilters.year} onChange={(e) => setAutoscoutFilters({ ...autoscoutFilters, year: e.target.value })} className="border p-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="number" placeholder="Max przebieg" value={autoscoutFilters.mileage} disabled className="border p-2 rounded shadow bg-gray-100" />
            </div>

            <div className="w-full h-[500px] bg-white rounded-xl shadow p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={autoscoutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, findMaxPrice(autoscoutData)]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avg_price" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
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
