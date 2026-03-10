import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Clients from './pages/Clients';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Toutes les pages ci-dessous seront entourées par la Sidebar */}
        <Route path="/" element={<Sidebar><Dashboard /></Sidebar>} />
        <Route path="/products" element={<Sidebar><Products /></Sidebar>} />
        <Route path="/clients" element={<Sidebar><Clients /></Sidebar>} />
      </Routes>
    </Router>
  );
}

export default App;
