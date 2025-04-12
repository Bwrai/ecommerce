import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Footer from "./components/layout/Footer/Footer";
import Header from "./components/layout/Header/Header";
import Alert from './components/Alert/Alert';
import "./styles/Alert.css";
import ProductDetails from "./components/Product/ProductDetails";
import Products from "./components/Product/Products";
import Search from "./components/Product/Search";
import AuthPage from "./components/User/AuthPage";
import { store } from './app/store'
import { useEffect } from "react";
import { loadUser } from "./features/User/userSlice";
import { useSelector } from "react-redux";
import Profile from "./components/User/Profile";
import ProtectedRoute from "./components/routes/ProtectedRoute";


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <Header />
      {/* {isAuthenticated && <UserOptions user={user} />} */}
      <Alert />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/search/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<AuthPage />} />


        {/* User Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Profile />} />
        </Route>


        {/* Admin Routes */}
        <Route element={<ProtectedRoute isAdmin={true} />}>

        </Route>

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

