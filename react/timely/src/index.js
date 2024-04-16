import React from 'react';
import ReactDOM from 'react-dom/client';
import Introduction from './components/Introduction.tsx';
import Login from './components/Login.tsx';
import Home from './components/Home.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css';
import ErrorPage from './components/ErrorPage.tsx';
import Me from './components/Me.tsx';
import Activities from './components/Activities.tsx';
import People from './components/People.tsx';
import FindTheTime from './components/FindTheTime.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Introduction />,
    errorElement: <ErrorPage />
  },
  {
    path:'/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <div>TODO</div>,
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        path: '/home',
        element: <Me></Me>
      },
      {
        path: '/home/people',
        element: <People></People>
      },
      {
        path: '/home/activities',
        element: <Activities></Activities>
      },
      {
        path: '/home/find-the-time',
        element: <FindTheTime></FindTheTime>
      },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
