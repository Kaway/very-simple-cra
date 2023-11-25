import React from 'react'
import ReactDOM from 'react-dom/client'
import Calendar from './components/Calendar.jsx'
import './index.css'
import {createHashRouter, RouterProvider} from "react-router-dom";
import Summary from "./components/Summary.jsx";

const router = createHashRouter([
    {
        path: "/",
        element: <Calendar />,
    },
    {
        path: "/summary",
        element: <Summary />
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
