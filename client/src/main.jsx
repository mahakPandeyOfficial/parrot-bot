import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import App from './App.jsx'
import './index.css'
import Homepage from './routes/homepage/Homepage.jsx';
import Dashboard from './routes/dashboard/Dashboard.jsx';
import Login from './routes/loginpage/Login.jsx';
import Register from './routes/registerpage/Register.jsx';
import Chatpage from './routes/chatpage/Chatpage.jsx';
import RootLayout from './layouts/rootLayout/RootLayout.jsx';
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout.jsx';




//routers
const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {
        path: "/",
        element: <Homepage/>,
      },

      {
        path: "/sign-in/*",
        element: <Login/>,
      },
      {
        path: "/sign-up/*",
        element: <Register/>,
      },
      {
        
        element: <DashboardLayout/>,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard/>
          },
          {
            path: "/dashboard/chats/:id",
            element: <Chatpage/>
          }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
