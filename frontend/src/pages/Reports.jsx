import React from 'react';
import { Target, Zap, TrendingUp } from 'lucide-react';

const Reports = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Analyses de Performance IA</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <Target className="mb-4" size={32}/>
          <p className="text-indigo-100 text-sm uppercase font-bold tracking-widest">Précision de l'IA</p>
          <p className="text-4xl font-black mt-1">94.2%</p>
          <p className="text-xs mt-4 opacity-80">+2.4% par rapport au mois dernier</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Zap className="text-yellow-500 mb-4" size={32}/>
          <p className="text-gray-500 text-sm uppercase font-bold">Leads "Hot" identifiés</p>
          <p className="text-4xl font-black text-slate-800 mt-1">458</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <TrendingUp className="text-green-500 mb-4" size={32}/>
          <p className="text-gray-500 text-sm uppercase font-bold">C.A. Prévisionnel</p>
          <p className="text-4xl font-black text-slate-800 mt-1">12,400 €</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center border-dashed border-2">
        <div className="text-center">
          <div className="animate-pulse flex justify-center mb-4 text-blue-500 font-bold italic underline">
            [ Graphiques de conversion en cours de chargement... ]
          </div>
          <p className="text-gray-400 text-sm">Ici, vous pouvez intégrer une bibliothèque comme **Recharts** ou **Chart.js**.</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;