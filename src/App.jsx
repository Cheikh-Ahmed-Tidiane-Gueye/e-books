import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inscription from './Pages/inscription-connection/Inscription';
import Connection from './Pages/inscription-connection/Connection';
import DashboardUser from './Pages/dashboard/DashboardUser';
import DashboardAdmin from './Pages/dashboard/DashboardAdmin';


export default function App() {


  // Récupérer l'état d'authentification du stockage local
  const storedAuth = localStorage.getItem('isAuthenticated');
  const initialAuthState = storedAuth === 'true';

  // Utilisez initialAuthState comme état initial pour l'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState);

  // Utilisez setIsAuthenticated pour modifier l'état d'authentification dans votre application


  return(
    <Router>
      <Routes>
        <Route path="/" element={<Connection setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/inscription" element={<Inscription setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/dashboarduser" element={isAuthenticated ? <DashboardUser/> : <Navigate to="/" />} />
        <Route path="/dashboardadmin" element={isAuthenticated ? <DashboardAdmin/> : <Navigate to="/" />} />
      </Routes>
    </Router>
  )
}