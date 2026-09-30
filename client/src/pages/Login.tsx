import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const dest = (location.state as any)?.from || "/";
      navigate(dest);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h2 className="font-montserrat font-extrabold text-2xl text-voxla-ink mb-1">Sign in to Voxla</h2>
      <p className="text-sm font-inter text-voxla-mid mb-6">Compare prices and check out with VoxlaPay.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter outline-none"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter outline-none"
        />
        {error && <p className="text-xs font-inter text-red-600">{error}</p>}
        <button disabled={loading} className="rounded-lg py-2.5 text-sm font-inter font-bold text-white bg-voxla-orange disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="text-xs font-inter text-voxla-mid mt-4">
        No account? <Link to="/register" className="text-voxla-blue font-semibold">Create one</Link>
      </p>
    </section>
  );
}
