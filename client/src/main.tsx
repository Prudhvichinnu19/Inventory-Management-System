import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set the title of the application
document.title = "Inventory Management System";

createRoot(document.getElementById("root")!).render(<App />);
