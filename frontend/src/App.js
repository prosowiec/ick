import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./HomePage";
import ChartPage from "./ChartPage";
import ComparePage from "./ComparePage";
import OpiniePage from "./OpiniePage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        {/* Kafelkowe menu */}
        <nav className="mb-8 flex justify-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-6 py-3 rounded-xl shadow-md transition duration-200 text-lg font-semibold
              ${isActive ? "bg-blue-500 text-white" : "bg-white text-gray-800 hover:bg-gray-200"}`
            }
          >
            Samochody
          </NavLink>
          <NavLink
            to="/chart"
            className={({ isActive }) =>
              `px-6 py-3 rounded-xl shadow-md transition duration-200 text-lg font-semibold
              ${isActive ? "bg-blue-500 text-white" : "bg-white text-gray-800 hover:bg-gray-200"}`
            }
          >
            Wykres cen
          </NavLink>
          <NavLink
            to="/opinie"
            className={({ isActive }) =>
              `px-6 py-3 rounded-xl shadow-md transition duration-200 text-lg font-semibold
              ${isActive ? "bg-blue-500 text-white" : "bg-white text-gray-800 hover:bg-gray-200"}`
            }
          >
            Opinie
          </NavLink>
        </nav>

        {/* Routing */}
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
