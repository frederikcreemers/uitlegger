import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import ExplanationPage from "./pages/ExplanationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/uitleg/:languageCode/:slug"
          element={<ExplanationPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
