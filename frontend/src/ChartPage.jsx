import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function ChartPage() {
  const [otomotoData, setOtomotoData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/otomoto?limit=50`)
      .then((res) => res.json())
      .then((data) => setOtomotoData(data.data))
      .catch((err) => console.error(err));
  }, []);

  // Przygotowujemy dane do wykresu
  const chartData = otomotoData.map((car, index) => ({
    name: `${car.brand} ${car.model} ${car.year}`,
    price: car.price
  }));

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">Wykres cen Otomoto 📈</h1>
      <div className="w-full h-[500px] bg-white rounded-lg shadow-md p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={150}/>
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
