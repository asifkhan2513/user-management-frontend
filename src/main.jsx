
import { createRoot } from "react-dom/client"; 
import "./index.css";
import App from "./App.jsx";
import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/opensans/v17/mem5YaGs126MiZpBA-UN7rgOUerl.ttf",
      fontWeight: 700,
    },
  ],
});

createRoot(document.getElementById("root")).render(<App />);
