import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router-dom'
import Homepage from './pages/homepage/Homepage'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Chatpage from './pages/chatpage/Chatpage'
import RootLayout from './layouts/rootLayout/RootLayout'
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout'
import Signin from './pages/signinpage/Signin'
import Signup from './pages/signuppage/Signup'




const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        {
          path: '/',
          element: <Homepage />,
        },
        {
          path: '/sign-in/*',
          element: <Signin />,
        },
        {
          path: '/sign-up/*',
          element: <Signup />,
        },
        {

          element: <DashboardLayout />,
          children: [
            {
              path: '/dashboard',
              element: <Dashboard />,
            },
            {
              path: '/dashboard/chats/:id',
              element: <Chatpage />,
            }
          ]
        }
      ]
    },
  ]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
