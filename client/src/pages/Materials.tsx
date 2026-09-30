import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import { api } from "../api/client";
import { Material, SupplierOption } from "../types";
import MaterialCard from "../components/MaterialCard";
import CompareModal from "../components/CompareModal";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  "All", "Cement", "Iron Rods", "Sand & Aggregate", "Blocks", "Tiles",
  "Roofing", "Plumbing", "Electrical", "Doors & Windows", "Paints & Timber", "Hardware",
];

export default function Materials({ onAdded }: { onAdded: () => void }) {
  const [params, setParams] = useSearchParams();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(params.get("query") || "");
  const [activeCat, setActiveCat] = useState(params.get("category") || "All");
  const [compareMaterial, setCompareMaterial] = useState<Material | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    api
      .get("/materials", { params: { query, category: activeCat } })
      .then((res) => setMaterials(res.data))
      .finally(() => setLoading(false));
    const next = new URLSearchParams();
    if (query) next.set("query", query);
    if (activeCat !== "All") next.set("category", activeCat);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeCat]);

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
    onAdded();
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-5 rounded bg-voxla-orange" />
            <h2 className="font-montserrat font-extrabold text-2xl text-voxla-ink">Price Index</h2>
          </div>
          <p className="text-sm mt-1 font-inter text-voxla-mid">Live market ranges from suppliers on Voxla.</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search materials…"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-inter outline-none"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-inter font-bold border transition-colors ${
              activeCat === cat ? "border-voxla-blue bg-voxla-blue text-white" : "border-gray-200 bg-white text-voxla-slate"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-center py-16 text-voxla-mid font-inter">Loading materials…</p>}

      {!loading && materials.length === 0 && (
        <div className="text-center py-16 text-voxla-mid font-inter">
          <Filter size={28} className="mx-auto mb-3 opacity-50" />
          No materials match your search.
        </div>
      )}

      {!loading && materials.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => (
            <MaterialCard key={m.id} m={m} onCompare={setCompareMaterial} />
          ))}
        </div>
      )}

      <CompareModal material={compareMaterial} onClose={() => setCompareMaterial(null)} onAdd={handleAdd} />
    </section>
  );
}
