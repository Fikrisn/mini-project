import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import ProductList from "./pages/ProductList";
import OrderList from "./pages/OrderList";
import PaymentList from "./pages/PaymentList";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import UserRegisterForm from "./components/UserRegisterForm"; 
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="payments" element={<PaymentList />} />
          <Route path="/register" element={<UserRegisterForm />} />
        </Route>
      </Route>
    </Routes>
  );
}
