import React, { useState, useEffect } from 'react';

interface Ticket {
  id: number;
  title: string;
  description: string;
  category?: string;
  ai_summary?: string;
  severity?: string;
  status: string;
  auto_resolved: boolean;
}

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('http://localhost:8000/tickets');
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl max-h-[600px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 All Tickets ({tickets.length})</h2>
      
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-800">{ticket.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                ticket.auto_resolved ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {ticket.status}
              </span>
            </div>
            
            {ticket.category && (
              <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mb-2">
                {ticket.category}
              </span>
            )}
            
            {ticket.ai_summary && (
              <p className="text-gray-600 text-sm mb-3">🤖 {ticket.ai_summary}</p>
            )}
            
            <p className="text-gray-500 text-sm line-clamp-2">{ticket.description}</p>
          </div>
        ))}
      </div>
      
      {tickets.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>🎉 No tickets yet. Create one above!</p>
        </div>
      )}
    </div>
  );
}