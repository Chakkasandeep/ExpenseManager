import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";  // Make sure you create this

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
