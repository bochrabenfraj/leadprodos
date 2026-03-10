import React from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

const Products = () => {
  const products = [
    { id: 1, name: "Licence Cloud Pro", category: "Software", price: "299€", stock: "Unlimited" },
    { id: 2, name: "Serveur IA - NVIDIA H100", category: "Hardware", price: "25,000€", stock: "5" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Catalogue Produits</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={18}/> Nouveau Produit
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
            <input type="text" placeholder="Rechercher un produit..." className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Nom du produit</th>
              <th className="px-6 py-4 text-left font-semibold">Catégorie</th>
              <th className="px-6 py-4 text-left font-semibold">Prix</th>
              <th className="px-6 py-4 text-left font-semibold">Statut Stock</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50 transition">
                <td className="px-6 py-4 font-medium text-slate-700">{p.name}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{p.category}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{p.price}</td>
                <td className="px-6 py-4 text-sm text-blue-600 font-medium">{p.stock}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600"><Edit2 size={16}/></button>
                    <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;