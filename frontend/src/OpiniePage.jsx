import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewsPage = () => {
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

  // Pobieranie danych po załadowaniu komponentu
  useEffect(() => {
    axios.get("http://localhost:8000/reviews/options")
      .then((res) => {
        const data = res.data.options || res.data;
        setOptions(data);

        const uniqueMakes = [...new Set(data.map(o => o.make))];
        setMakes(uniqueMakes);
      })
      .catch((err) => console.error("Błąd pobierania opcji:", err));
  }, []);

  // Aktualizacja modeli po wyborze marki
  useEffect(() => {
    if (!selectedMake) return;
    const filtered = options.filter(o => o.make === selectedMake);
    const uniqueModels = [...new Set(filtered.map(o => o.model))];
    setModels(uniqueModels);
    setSelectedModel("");
    setYears([]);
    setSelectedYear("");
  }, [selectedMake]);

  // Aktualizacja lat po wyborze modelu
  useEffect(() => {
    if (!selectedMake || !selectedModel) return;
    const filtered = options.filter(o => o.make === selectedMake && o.model === selectedModel);
    const uniqueYears = [...new Set(filtered.map(o => o.year))];
    setYears(uniqueYears.sort((a, b) => b - a));
    setSelectedYear("");
  }, [selectedModel]);

  // Obsługa wysyłki formularza
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
      })
      .catch(err => {
        console.error("Błąd zapisu opinii:", err);
        alert("Nie udało się zapisać opinii.");
      });
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Dodaj opinię</h2>

      {submitted && (
        <p className="text-green-600 mb-4 text-center">Opinia została dodana!</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Marka */}
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

        {/* Model */}
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

        {/* Rok */}
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

        {/* Autor */}
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

        {/* Ocena */}
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

        {/* Komentarz */}
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

        {/* Przycisk */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600"
        >
          Wyślij opinię
        </button>
      </form>
    </div>
  );
};

export default ReviewsPage;
