import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

// @import pages
import NotFound from "./pages/404";
import HomeScreen from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
