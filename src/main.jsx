import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "./utils/fontawesome";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/Login-form/">
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        containerStyle={{ bottom: 80 }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>
);
