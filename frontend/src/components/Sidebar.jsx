import React from 'react';
import { LayoutDashboard, Package, Users, BarChart3, Settings, LogOut, Cpu } from 'lucide-react';

const Sidebar = ({ children }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20}/>, label: "Dashboard", active: true },
    { icon: <Package size={20}/>, label: "Produits" },
    { icon: <Users size={20}/>, label: "Leads & Clients" },
    { icon: <BarChart3 size={20}/>, label: "Rapports IA" },
    { icon: <Settings size={20}/>, label: "Paramètres" },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg"><Cpu size={24}/></div>
          <span className="text-xl font-bold tracking-tight">LeadProdos<span className="text-blue-400">.ia</span></span>
        </div>
        
        <nav className="flex-1 px-4 mt-4">
          {menuItems.map((item, index) => (
            <div key={index} className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors mb-2 ${item.active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-4 text-gray-400 hover:text-red-400 transition-colors w-full p-3">
            <LogOut size={20}/>
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;