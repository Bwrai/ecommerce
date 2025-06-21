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
import { useEffect } from "react";
import { loadUser } from "./features/User/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./components/User/Profile";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Loader from "./components/layout/Loader/Loader";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";


function App() {
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, []);

  if (loading) return <Loader />
  return (
    <Router>
      <Header />
      <Alert />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/search/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile />} />
          <Route path="/me/password/update" element={<UpdatePassword />} />
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

