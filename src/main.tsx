import React from "react";
import ReactDOM from "react-dom/client";
import App from "./ui/App";
import { browserCVCreationDependencies } from "./infrastructure/cv/browserCVCreationDependencies";
import "./ui/styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Application root element "#root" was not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App cvCreationDependencies={browserCVCreationDependencies} />
  </React.StrictMode>,
);