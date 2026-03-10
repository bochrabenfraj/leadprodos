import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importe le moteur de navigation

const Login = () => {
  const navigate = useNavigate(); // Crée la fonction de redirection

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/'); // Redirige vers le Dashboard (la racine)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* ... ton code existant ... */}
      <button 
        onClick={handleLogin} 
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        Accéder à l'IA
      </button>
    </div>
  );
};