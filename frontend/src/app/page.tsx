'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    setError("");

    try {
      const response = await fetch('http://localhost:8000/travel-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.Detail || "Something went wrong")
      }

      const data = await response.json();
      setAnswer(data?.response || 'No answer received.');
    } catch (err:any) {
      // console.error(err);
      setError(err.message || " Something went wrong")
      setAnswer('Error fetching response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        Travel Assistant
      </h1>
      <div className="w-full max-w-xl space-y-4">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
          placeholder="e.g., What documents do I need to travel from Kenya to Ireland?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-75"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"
                  />
                </svg>
                <span>Getting info...</span>
              </span>
            ) : (
              "Submit Question"
            )}
          </button>
          <button
            onClick={() => {
              setQuestion("");
              setAnswer("");
              setError("");
            }}
            className="flex-1 bg-red-600 text-white-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
            disabled={loading}
          >
            Clear
          </button>
        </div>

        {answer && (
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow mt-4">
            <h2 className="font-semibold text-gray-800 mb-2">Response:</h2>
            <p className="text-gray-700 whitespace-pre-line">{answer}</p>
          </div>
        )}
      </div>
    </main>
  );
}
