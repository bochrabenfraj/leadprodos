import React from 'react';

const Clients = () => {
  const leads = [
    { id: 1, name: "Sophie Martin", source: "LinkedIn", interest: "Cloud Computing", score: 85 },
    { id: 2, name: "Marc Lévy", source: "Twitter/X", interest: "Cybersecurity", score: 42 },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Base Clients & Leads IA</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Lancer une analyse IA</button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {leads.map(lead => (
          <div key={lead.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center border-l-4 border-indigo-500">
            <div>
              <p className="font-bold text-lg">{lead.name}</p>
              <p className="text-sm text-gray-500 italic text-sm">Source détectée : {lead.source}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Score de pertinence</p>
              <span className={`text-xl font-black ${lead.score > 70 ? 'text-green-500' : 'text-orange-500'}`}>
                {lead.score}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;