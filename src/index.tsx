import { createRoot } from "react-dom/client";
import { App } from "./App";

// Import global CSS from Stellar Design System
import "@stellar/design-system/build/styles.min.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
