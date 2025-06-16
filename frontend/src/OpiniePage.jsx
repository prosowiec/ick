import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState("add"); // "add" lub "view"

  const [options, setOptions] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/reviews/options")
      .then((res) => {
        const data = res.data.options || res.data;
        setOptions(data);
        const uniqueMakes = [...new Set(data.map(o => o.make))];
        setMakes(uniqueMakes);
      })
      .catch((err) => console.error("Błąd pobierania opcji:", err));

    fetchReviews();
  }, []);

  const fetchReviews = () => {
    axios.get("http://localhost:8000/reviews")
      .then(res => {
        setReviews(res.data);
      })
      .catch(err => {
        console.error("Błąd pobierania opinii:", err);
      });
  };

  useEffect(() => {
    if (!selectedMake) return;
    const filtered = options.filter(o => o.make === selectedMake);
    const uniqueModels = [...new Set(filtered.map(o => o.model))];
    setModels(uniqueModels);
    setSelectedModel("");
    setYears([]);
    setSelectedYear("");
  }, [selectedMake]);

  useEffect(() => {
    if (!selectedMake || !selectedModel) return;
    const filtered = options.filter(o => o.make === selectedMake && o.model === selectedModel);
    const uniqueYears = [...new Set(filtered.map(o => o.year))];
    setYears(uniqueYears.sort((a, b) => b - a));
    setSelectedYear("");
  }, [selectedModel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const brand_model_year = `${selectedMake};${selectedModel};${selectedYear}`;

    axios.post("http://localhost:8000/reviews", {
      brand_model_year,
      author,
      rating,
      comment
    })
      .then(() => {
        setSubmitted(true);
        setAuthor("");
        setRating("5");
        setComment("");
        setSelectedMake("");
        setSelectedModel("");
        setSelectedYear("");
        fetchReviews();
      })
      .catch(err => {
        console.error("Błąd zapisu opinii:", err);
        alert("Nie udało się zapisać opinii.");
      });
  };
const filteredReviews = () => {
  return reviews.filter(r => {
    const [make, model, year] = r.brand_model_year.split(";");
    return (
      (!selectedMake || make === selectedMake) &&
      (!selectedModel || model === selectedModel) &&
      (!selectedYear || year === selectedYear)
    );
  });
};
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
      {/* Menu */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 rounded font-semibold transition-colors duration-200
            ${activeTab === "add" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-black"}`}
        >
          Dodaj opinię
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`px-4 py-2 rounded font-semibold transition-colors duration-200
            ${activeTab === "view" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-black"}`}
        >
          Wyświetl opinie
        </button>
      </div>
      {/* Sekcja: Dodaj opinię */}
      {activeTab === "add" && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-center">Dodaj opinię</h2>
          {submitted && (
            <p className="text-green-600 mb-4 text-center">Opinia została dodana!</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Marka</label>
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                <option value="">-- Wybierz markę --</option>
                {makes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full border rounded p-2"
                required
                disabled={!selectedMake}
              >
                <option value="">-- Wybierz model --</option>
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Rok</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full border rounded p-2"
                required
                disabled={!selectedModel}
              >
                <option value="">-- Wybierz rok --</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Autor</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Twoje imię (opcjonalnie)"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Ocena</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Komentarz</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded p-2"
                rows="4"
                required
                placeholder="Twoja opinia"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600"
            >
              Wyślij opinię
            </button>
          </form>
        </>
      )}

      {/* Sekcja: Wyświetl opinie */}
{activeTab === "view" && (
  <div>
    <h3 className="text-xl font-semibold mb-4 text-center">Wszystkie opinie</h3>

    {/* Filtry */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium mb-1">Marka</label>
        <select
          value={selectedMake}
          onChange={(e) => setSelectedMake(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Wszystkie</option>
          {makes.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Model</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full border rounded p-2"
          disabled={!selectedMake}
        >
          <option value="">Wszystkie</option>
          {models.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Rok</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full border rounded p-2"
          disabled={!selectedModel}
        >
          <option value="">Wszystkie</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Opinie po filtrowaniu */}
    {filteredReviews().length === 0 ? (
      <p className="text-gray-500 text-center">Brak pasujących opinii.</p>
    ) : (
      <ul className="space-y-4">
        {filteredReviews().map((r, index) => {
          const [make, model, year] = r.brand_model_year.split(";");
          return (
            <li key={index} className="border rounded p-4 shadow-sm">
              <p className="font-bold">{make} {model} ({year})</p>
              <p className="text-sm text-gray-600">Ocena: {r.rating} ★</p>
              <p className="italic text-sm">Autor: {r.author || "Anonim"}</p>
              <p className="mt-2">{r.comment}</p>
            </li>
          );
        })}
      </ul>
    )}
  </div>
)}
    </div>
    </div>
  );
};

export default ReviewsPage;
