import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function ChartPage() {
  const [otomotoData, setOtomotoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [brandFilter, setBrandFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/otomoto?limit=50`)
      .then((res) => res.json())
      .then((data) => {
        setOtomotoData(data.data);
        setFilteredData(data.data);  // Domyślnie ustawiamy filtr na pełne dane
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // Filtrowanie danych
    let filtered = otomotoData;

    if (brandFilter) {
      filtered = filtered.filter(car => car.brand.toLowerCase().includes(brandFilter.toLowerCase()));
    }
    if (priceFilter) {
      filtered = filtered.filter(car => car.price <= priceFilter);
    }

    setFilteredData(filtered);
  }, [brandFilter, priceFilter, otomotoData]);

  // Przygotowanie danych do wykresu
  const chartData = filteredData.map((car) => ({
    name: `${car.brand} ${car.model} ${car.year}`,
    price: car.price
  }));

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">Wykres cen Otomoto 📈</h1>

      {/* Filtry */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Filtruj po marce"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Filtruj po cenie"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Wykres */}
      <div className="w-full h-[500px] bg-white rounded-lg shadow-md p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={150} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartPage;
