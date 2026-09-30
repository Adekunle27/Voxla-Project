import { useEffect, useState } from "react";
import {
  Search,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Truck,
  BadgeCheck,
  ReceiptText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { Material, SupplierOption } from "../types";
import PriceTicker from "../components/PriceTicker";
import MaterialCard from "../components/MaterialCard";
import MaterialVisual from "../components/MaterialVisual";
import CompareModal from "../components/CompareModal";
import { useCart } from "../context/CartContext";

const SHOP_CATEGORIES = [
  "Cement",
  "Iron Rods",
  "Sand & Aggregate",
  "Blocks",
  "Tiles",
  "Roofing",
  "Plumbing",
  "Electrical",
  "Doors & Windows",
];

export default function Home() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [compareMaterial, setCompareMaterial] = useState<Material | null>(null);
  const navigate = useNavigate();
  const { addItem } = useCart();

  useEffect(() => {
    api
      .get("/materials")
      .then((res) => setMaterials(res.data))
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  function handleAdd(material: Material, supplier: SupplierOption) {
    addItem({
      materialId: material.id,
      materialName: material.name,
      supplierId: supplier.supplierId,
      supplierName: supplier.name,
      price: supplier.price,
      unit: material.unit,
      qty: 1,
    });
    setCompareMaterial(null);
  }

  const featured = Object.values(
    materials.reduce((acc: Record<string, Material>, m) => {
      if (!acc[m.category]) acc[m.category] = m;
      return acc;
    }, {}),
  ).slice(0, 8);

  return (
    <div>
      <section className="text-white bg-voxla-blueDark overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid lg:grid-cols-[1.05fr_.95fr] items-center gap-10">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-5 bg-orange-500/15 text-voxla-orange">
              <ShieldCheck size={13} /> Verified suppliers. Fair prices.
            </span>
            <h1 className="font-montserrat font-extrabold text-3xl sm:text-5xl leading-[1.1] max-w-3xl">
              Build smarter. Buy with confidence.
            </h1>
            <p className="mt-4 max-w-xl text-white/75 text-sm sm:text-base">
              Shop essential building materials from verified suppliers across
              Nigeria. Compare offers, add to cart, and check out in one place.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get("q") as string;
                navigate(
                  `/materials${q ? `?query=${encodeURIComponent(q)}` : ""}`,
                );
              }}
              className="mt-8 w-full max-w-xl flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-xl"
            >
              <Search size={18} className="ml-2 shrink-0 text-voxla-mid" />
              <input
                name="q"
                placeholder="Search cement, iron rods, tiles..."
                className="flex-1 outline-none text-sm py-2 text-slate-800"
              />
              <button
                type="submit"
                className="rounded-lg px-4 py-2.5 text-sm font-bold text-white shrink-0 bg-voxla-orange"
              >
                Shop now
              </button>
            </form>
            <div className="flex items-center gap-8 mt-9 text-center flex-wrap justify-center lg:justify-start">
              {[
                ["33+", "Materials"],
                ["150+", "Suppliers"],
                ["9", "Cities"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-montserrat font-extrabold text-xl sm:text-2xl text-voxla-orange">
                    {n}
                  </div>
                  <div className="text-[11px] text-white/60 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[290px] sm:min-h-[360px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85"
              alt="Building project under construction"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-voxla-blueDark/85 via-voxla-blueDark/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 text-voxla-ink p-4 shadow-lg text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-voxla-orange">
                Today on Voxla
              </p>
              <p className="font-montserrat font-extrabold mt-1">
                Verified stock. Transparent prices.
              </p>
              <p className="text-xs text-voxla-mid mt-1">
                From your first bag of cement to finishing touches.
              </p>
            </div>
          </div>
        </div>
        {materials.length > 0 && <PriceTicker items={materials.slice(0, 14)} />}
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] font-bold text-voxla-orange">
              {/* Shop by project need */}
            </p>
            <h2 className="font-montserrat py-4 font-extrabold text-2xl mt-1 text-voxla-ink">
              Everything your site needs
            </h2>
          </div>
          <button
            onClick={() => navigate("/materials")}
            className="text-sm font-bold text-voxla-blue whitespace-nowrap"
          >
            View catalog
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-stretch">
          {SHOP_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() =>
                navigate(`/materials?category=${encodeURIComponent(category)}`)
              }
              className="group text-left rounded-xl bg-white border border-slate-200 overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col h-full"
            >
              <MaterialVisual
                category={category}
                className="h-36 w-full rounded-none shrink-0"
              />
              <span className="flex items-center min-h-[2.75rem] p-2.5 text-xs font-bold text-voxla-ink group-hover:text-voxla-blue leading-snug">
                {category}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <div>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-5 rounded bg-voxla-orange" />
              <h2 className="font-montserrat font-extrabold text-2xl text-voxla-ink">
                Popular Materials
              </h2>
            </div>
            <p className="text-sm mt-1 text-voxla-mid">
              Best-selling supplies from our verified marketplace.
            </p>
          </div>
          <button
            onClick={() => navigate("/materials")}
            className="inline-flex items-center gap-1 text-sm font-bold text-voxla-blue"
          >
            Browse all <ArrowRight size={15} />
          </button>
        </div>
        {loading && (
          <p className="text-center py-16 text-voxla-mid">
            Loading materials...
          </p>
        )}
        {!loading && loadError && (
          <div className="text-center py-14 rounded-xl border border-amber-200 bg-amber-50 flex flex-col items-center gap-2">
            <AlertTriangle size={22} className="text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">
              Couldn't load materials from the API.
            </p>
            <p className="text-xs text-amber-700">
              Check that the backend is running and seeded.
            </p>
          </div>
        )}
        {!loading && !loadError && featured.length === 0 && (
          <div className="text-center py-14 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
            No materials are available yet.
          </div>
        )}
        {!loading && featured.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((m) => (
              <MaterialCard key={m.id} m={m} onCompare={setCompareMaterial} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-3 gap-6">
          {[
            [
              Truck,
              "Delivery-ready suppliers",
              "See delivery times before you add an item.",
            ],
            [
              BadgeCheck,
              "Verified marketplace",
              "Compare trusted supplier offers with confidence.",
            ],
            [
              ReceiptText,
              "Simple checkout",
              "Keep your material orders together in one cart.",
            ],
          ].map(([Icon, title, copy]) => {
            const FeatureIcon = Icon as typeof Truck;
            return (
              <div key={title as string} className="flex gap-3 items-start">
                <div className="rounded-full bg-orange-50 p-2 text-voxla-orange">
                  <FeatureIcon size={19} />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-sm text-voxla-ink">
                    {title as string}
                  </h3>
                  <p className="text-xs mt-1 leading-relaxed text-voxla-mid">
                    {copy as string}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <CompareModal
        material={compareMaterial}
        onClose={() => setCompareMaterial(null)}
        onAdd={handleAdd}
      />
    </div>
  );
}
