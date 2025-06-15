import { useState } from "react";

function ReviewForm({ onSubmitSuccess }) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      await fetch("http://localhost:8000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, text }),
      });
      setAuthor("");
      setText("");
      onSubmitSuccess(); // odśwież listę opinii
    } catch (err) {
      console.error("Błąd dodawania opinii:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        placeholder="Twoje imię (opcjonalnie)"
        className="w-full p-2 border border-gray-300 rounded-lg mb-3"
      />
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Twoja opinia..."
        rows="4"
        className="w-full p-3 border border-gray-300 rounded-lg mb-3"
        required
      ></textarea>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Wysyłanie..." : "Dodaj opinię"}
      </button>
    </form>
  );
}

export default ReviewForm;
