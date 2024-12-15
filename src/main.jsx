import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./scss/main.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "../src/components/ui/provider.jsx"

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  // </StrictMode>
);
