import React, { useState, useEffect } from 'react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-12">
          🤖 AI Ticketing System
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <TicketForm />
          <TicketList />
        </div>
      </div>
    </div>
  );
}

export default App;