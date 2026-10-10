import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Menu, LogOut } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Nav({ onCartClick }: { onCartClick: () => void }) {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="sticky top-0 z-40 bg-voxla-blueDark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-inter font-semibold text-white/85">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/materials" className="hover:text-white">Price Index</Link>
          <Link to="/suppliers" className="hover:text-white">Suppliers</Link>
          {user?.role === "SUPPLIER" && <Link to="/supplier/dashboard" className="hover:text-white">Dashboard</Link>}
          {user?.role === "ADMIN" && <Link to="/admin/suppliers" className="hover:text-white">Verification</Link>}
          {user?.role === "BUYER" && <Link to="/orders" className="hover:text-white">My Orders</Link>}
          <Link to="/wishlist" className="hover:text-white">Saved</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <button onClick={logout} className="hidden sm:flex items-center gap-1 text-xs font-inter font-semibold text-white/80 hover:text-white">
              <LogOut size={14} /> {user.name.split(" ")[0]}
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="hidden sm:block text-xs font-inter font-semibold text-white/80 hover:text-white">
              Sign in
            </button>
          )}
          {user?.role !== "SUPPLIER" && <button onClick={onCartClick} className="relative p-2 rounded-lg hover:bg-white/10" aria-label="Cart">
            <ShoppingCart size={20} color="#fff" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center text-white bg-voxla-orange">
                {cartCount}
              </span>
            )}
          </button>}
          <Link to="/wishlist" className="p-2 rounded-lg hover:bg-white/10" aria-label="Saved products"><Heart size={19} color="#fff" /></Link>
          <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)}>
            <Menu size={20} color="#fff" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden flex flex-col gap-1 px-4 pb-4 text-white/90 text-sm font-inter font-semibold">
          <Link to="/materials" className="py-2" onClick={() => setOpen(false)}>Price Index</Link>
          <Link to="/suppliers" className="py-2" onClick={() => setOpen(false)}>Suppliers</Link>
          {user?.role === "SUPPLIER" && <Link to="/supplier/dashboard" className="py-2" onClick={() => setOpen(false)}>Dashboard</Link>}
          {user?.role === "ADMIN" && <Link to="/admin/suppliers" className="py-2" onClick={() => setOpen(false)}>Verification</Link>}
          {user?.role === "BUYER" && <Link to="/orders" className="py-2" onClick={() => setOpen(false)}>My Orders</Link>}
          <Link to="/wishlist" className="py-2" onClick={() => setOpen(false)}>Saved products</Link>
          {user ? (
            <button className="py-2 text-left" onClick={() => { logout(); setOpen(false); }}>Sign out</button>
          ) : (
            <Link to="/login" className="py-2" onClick={() => setOpen(false)}>Sign in</Link>
          )}
        </div>
      )}
    </header>
  );
}
