import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";

function ExplanationPage() {
  return <div>Explanation page placeholder</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uitleg/:languageCode/:slug" element={<ExplanationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
