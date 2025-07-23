'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');

    try {
      const response = await fetch('http://localhost:8000/travel-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setAnswer(data?.response || 'No answer received.');
    } catch (err) {
      console.error(err);
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

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? 'Getting info...' : 'Submit Question'}
        </button>

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
