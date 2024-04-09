import React from 'react';
import ReactDOM from 'react-dom/client';
import Introduction from './components/Introduction.tsx';
import Login from './components/Login.tsx';
import Home from './components/Home.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Introduction />
  },
  {
    path:'/login',
    element: <Login />
  },
  {
    path: '/register',
    element: null,  // TODO
  },
  {
    path: '/home',
    element: <Home />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
