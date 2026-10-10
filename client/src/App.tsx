import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Materials from "./pages/Materials";
import Suppliers from "./pages/Suppliers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import SupplierDashboard from "./pages/SupplierDashboard";
import AdminSupplierVerification from "./pages/AdminSupplierVerification";
import ProductDetail from "./pages/ProductDetail";
import PaymentCallback from "./pages/PaymentCallback";
import Wishlist from "./pages/Wishlist";
import { useAuth } from "./context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./context/CartContext";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function RequireSupplier({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (user.role !== "SUPPLIER") return <Navigate to="/" replace />;
  return children;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const { user } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen w-full bg-voxla-lightGrey font-inter text-voxla-ink">
      <Nav onCartClick={() => setCartOpen(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materials" element={<Materials onAdded={() => setCartOpen(true)} />} />
        <Route path="/materials/:id" element={<ProductDetail />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <Orders />
            </RequireAuth>
          }
        />
        <Route
          path="/supplier/dashboard"
          element={
            <RequireSupplier>
              <SupplierDashboard />
            </RequireSupplier>
          }
        />
        <Route path="/admin/suppliers" element={<RequireAdmin><AdminSupplierVerification /></RequireAdmin>} />
      </Routes>

      <footer className="bg-voxla-blueDark text-white/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center text-xs font-inter">
          voxla.ng · @voxla · hello@voxla.ng — Verified Prices. Trusted Suppliers.
        </div>
      </footer>

      {cartCount > 0 && user?.role === "BUYER" && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 right-5 z-30 rounded-full shadow-xl flex items-center gap-2 px-4 py-3 text-white font-inter font-bold text-sm sm:hidden bg-voxla-orange"
        >
          <ShoppingCart size={16} /> {cartCount}
        </button>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
