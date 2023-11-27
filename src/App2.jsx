import { useState } from 'react';
import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Inscription from './Pages/inscription-connection/Inscription';
import Connection from './Pages/inscription-connection/Connection';
import DashboardUser from './Pages/dashboard/DashboardUser';
import DashboardAdmin from './Pages/dashboard/DashboardAdmin';
import HomeUser from './Pages/dashboard/HomeUser';
import BooksUser from './Pages/dashboard/BooksUser';
import HomeAdmin from './Pages/dashboard/HomeAdmin';
import BooksAdmin from './Pages/dashboard/BooksAdmin';

export default function App() {
  
  // Récupérer l'état d'authentification du stockage local
  const storedAuth = localStorage.getItem('isAuthenticated');
  const initialAuthState = storedAuth === 'true';

  // Utilisez initialAuthState comme état initial pour l'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState);

  // Utilisez setIsAuthenticated pour modifier l'état d'authentification dans votre application

  const rooter = createBrowserRouter([
    {
      path: '/',
      element: <Connection setIsAuthenticated={setIsAuthenticated} />
    },
    {
      path: '/inscription',
      element: <Inscription setIsAuthenticated={setIsAuthenticated} />
    },
    {
      path: '/dashboarduser',
      element: isAuthenticated ? <DashboardUser/> : <Navigate to="/" />,
      children: [
        {
          path: '/dashboarduser/home',
          element: <HomeUser/>
        },
        {
          path: '/dashboarduser/books',
          element: <BooksUser/>
        },
      ]
    },
    {
      path: '/dashboardadmin',
      element: isAuthenticated ? <DashboardAdmin/> : <Navigate to="/" />,
      children: [
        {
          path: '/dashboardadmin/home',
          element: <HomeAdmin/>
        },
        {
          path: '/dashboardadmin/books',
          element: <BooksAdmin/>
        }
      ]
    }
  ]);

  return(
    <RouterProvider router={rooter} />
  )
}