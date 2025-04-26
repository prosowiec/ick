import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import ChartPage from "./ChartPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        <nav className="mb-8 flex justify-center space-x-8">
          <Link to="/" className="text-blue-500 hover:underline text-xl">
            Samochody
          </Link>
          <Link to="/chart" className="text-blue-500 hover:underline text-xl">
            Wykres cen
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chart" element={<ChartPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
