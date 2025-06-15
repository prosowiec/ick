import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import ChartPage from "./ChartPage";
import ComparePage from "./ComparePage";
import OpiniePage from "./OpiniePage";



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        <nav className="mb-8 flex justify-center space-x-8">
          <Link to="/" className="text-blue-500 hover:underline text-xl">Samochody</Link>
          <Link to="/chart" className="text-blue-500 hover:underline text-xl">Wykres cen</Link>
          <Link to="/opinie" className="text-blue-500 hover:underline text-xl">Opinie</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chart" element={<ChartPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/opinie" element={<OpiniePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
