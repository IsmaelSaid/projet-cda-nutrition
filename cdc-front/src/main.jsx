import React from "react";
import ReactDOM from "react-dom/client";
import App, { MyForm, Results } from "./App.jsx";
import "./index.css";

import { createBrowserRouter, Form, RouterProvider } from "react-router-dom";
import Root from "./App.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/form",
    element: <MyForm />,
  },
  {
    path: "/results",
    element: <Results />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
