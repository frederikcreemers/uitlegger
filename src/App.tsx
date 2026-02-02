import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import ExplanationPage from "./pages/ExplanationPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/uitleg/:languageCode/:slug"
          element={<ExplanationPage />}
        />
        <Route path="/praat" element={<ChatPage />} />
        <Route path="/praat/:languageCode" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
