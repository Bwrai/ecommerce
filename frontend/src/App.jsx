import Home from "./components/Home/Home";
import Footer from "./components/layout/Footer/Footer";
import Header from "./components/layout/Header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Home />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
