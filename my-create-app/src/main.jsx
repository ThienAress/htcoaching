import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// App
import App from "./App.jsx";
// Import global styles
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/utilities.css";
import "./styles/responsive.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
