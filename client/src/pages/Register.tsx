import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"BUYER" | "SUPPLIER">("BUYER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password, role, businessName, city);
      navigate(role === "SUPPLIER" ? "/supplier/dashboard" : "/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h2 className="font-montserrat font-extrabold text-2xl text-voxla-ink mb-1">Create your Voxla account</h2>
      <p className="text-sm font-inter text-voxla-mid mb-6">Compare prices as a buyer, or list materials as a supplier.</p>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          type="button"
          onClick={() => setRole("BUYER")}
          className={`rounded-lg border py-3 flex flex-col items-center gap-1.5 text-sm font-inter font-bold transition-colors ${
            role === "BUYER" ? "border-voxla-blue bg-voxla-lightBlue text-voxla-blue" : "border-gray-200 text-voxla-mid"
          }`}
        >
          <UserIcon size={18} /> Buyer
        </button>
        <button
          type="button"
          onClick={() => setRole("SUPPLIER")}
          className={`rounded-lg border py-3 flex flex-col items-center gap-1.5 text-sm font-inter font-bold transition-colors ${
            role === "SUPPLIER" ? "border-voxla-blue bg-voxla-lightBlue text-voxla-blue" : "border-gray-200 text-voxla-mid"
          }`}
        >
          <Store size={18} /> Supplier
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter outline-none"
        />
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
          minLength={6}
          placeholder="Password (6+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter outline-none"
        />

        {role === "SUPPLIER" && (
          <>
            <input
              required
              placeholder="Business name (e.g. Ile-Build Materials)"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter outline-none"
            />
            <input
              required
              placeholder="City (e.g. Ile-Ife)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter outline-none"
            />
            <p className="text-xs font-inter text-voxla-mid -mt-1">
              New supplier accounts start unverified — the "Verified" badge is added after manual review.
            </p>
          </>
        )}

        {error && <p className="text-xs font-inter text-red-600">{error}</p>}
        <button disabled={loading} className="rounded-lg py-2.5 text-sm font-inter font-bold text-white bg-voxla-orange disabled:opacity-50">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="text-xs font-inter text-voxla-mid mt-4">
        Already have an account? <Link to="/login" className="text-voxla-blue font-semibold">Sign in</Link>
      </p>
    </section>
  );
}
