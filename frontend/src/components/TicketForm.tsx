import React, { useState } from 'react';

export default function TicketForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:8000/tickets/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      
      const data = await res.json();
      setResult(data);
      setTitle(''); setDescription('');
    } catch (error) {
      alert('Error creating ticket');
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 New Ticket</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ticket Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <textarea
          placeholder="Describe your issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-bold hover:from-blue-700 transition-all"
        >
          {loading ? '🤖 AI Analyzing...' : '🚀 Submit Ticket'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <h3 className="font-bold text-green-800">✅ AI Analysis Complete!</h3>
          <pre className="text-sm mt-2 bg-white p-3 rounded-lg">{JSON.stringify(result.ai_analysis, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}