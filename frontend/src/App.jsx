import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Footer from "./components/layout/Footer/Footer";
import Header from "./components/layout/Header/Header";
import Alert from './components/Alert/Alert';
import "./styles/Alert.css";
import ProductDetails from "./components/Product/ProductDetails";
import Products from "./components/Product/Products";

function App() {
  return (
    <Router>
      <Header />
      <Alert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        {/* Add more routes here */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

