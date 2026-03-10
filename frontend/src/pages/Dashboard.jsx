import React from 'react';
import { Users, Package, TrendingUp, Cpu } from 'lucide-react'; // Icônes suggérées

const Dashboard = () => {
  const stats = [
    { title: "Total Produits", value: "124", icon: <Package />, color: "bg-blue-500" },
    { title: "Leads Identifiés", value: "1,240", icon: <Users />, color: "bg-green-500" },
    { title: "Taux de Conversion", value: "12%", icon: <TrendingUp />, color: "bg-purple-500" },
    { title: "Analyse IA active", value: "Live", icon: <Cpu />, color: "bg-red-500" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Tableau de Bord LeadProdos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className={`${stat.color} p-3 rounded-lg text-white mr-4`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Dernières Recommandations IA</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b">
              <th className="pb-3">Client</th>
              <th className="pb-3">Produit suggéré</th>
              <th className="pb-3">Score de matching</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-4 font-medium">Jean Dupont</td>
              <td>iPhone 15 Pro</td>
              <td className="text-green-600 font-bold">98%</td>
              <td><button className="text-blue-500 hover:underline">Contacter</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;