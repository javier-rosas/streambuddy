import "./App.css";

import { MemoryRouter, Route, Routes } from "react-router-dom";

import Home from "./components/home/Home";
import LandingExtension from "./components/landing-page/LandingPage";

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<LandingExtension />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );
}
