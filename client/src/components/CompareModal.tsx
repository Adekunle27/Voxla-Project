import { useEffect, useState } from "react";
import { X, MapPin, Star, Truck, ShoppingCart } from "lucide-react";
import { api } from "../api/client";
import { Material, SupplierOption } from "../types";
import { money } from "../utils/format";
import VerifiedBadge from "./VerifiedBadge";
import MaterialVisual from "./MaterialVisual";
import { useAuth } from "../context/AuthContext";

export default function CompareModal({
  material,
  onClose,
  onAdd,
}: {
  material: Material | null;
  onClose: () => void;
  onAdd: (material: Material, supplier: SupplierOption) => void;
}) {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!material) return;
    setLoading(true);
    api
      .get(`/materials/${material.id}/suppliers`)
      .then((res) => setSuppliers(res.data.suppliers))
      .finally(() => setLoading(false));
  }, [material]);

  if (!material) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/55">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[88vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-start justify-between p-5 border-b border-gray-200 gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <MaterialVisual category={material.category} imageUrl={material.imageUrl} className="w-14 h-14 shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] font-inter font-bold uppercase text-voxla-orange">{material.category}</div>
              <h3 className="font-montserrat font-extrabold text-lg leading-tight text-voxla-ink">{material.name}</h3>
              <p className="text-xs mt-0.5 font-inter text-voxla-mid">{material.spec}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 shrink-0">
            <X size={18} className="text-voxla-slate" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {loading && <p className="text-sm text-center text-voxla-mid font-inter py-6">Loading suppliers…</p>}
          {!loading &&
            suppliers.map((s) => (
              <div key={s.priceId} className="rounded-xl border border-gray-200 p-3.5 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-montserrat font-bold text-sm text-voxla-ink">{s.name}</span>
                      {s.verified && <VerifiedBadge small />}
                    </div>
                    <div className="flex items-center gap-2.5 mt-1 text-xs font-inter text-voxla-mid">
                      <span className="flex items-center gap-0.5"><MapPin size={12} /> {s.city}</span>
                      <span className="flex items-center gap-0.5"><Star size={12} className="fill-voxla-orange text-voxla-orange" /> {s.rating > 0 ? s.rating : "New"}</span>
                      <span className="flex items-center gap-0.5"><Truck size={12} /> {s.deliveryDays}d delivery</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-montserrat font-extrabold text-base text-voxla-blue">{money(s.price)}</div>
                    <div className="text-[10px] font-inter text-voxla-mid">per {material.unit}</div>
                  </div>
                </div>
                {user?.role !== "SUPPLIER" && <button
                  onClick={() => onAdd(material, s)}
                  className="w-full rounded-lg py-2 text-xs font-inter font-bold flex items-center justify-center gap-1.5 border border-voxla-blue text-voxla-blue"
                >
                  <ShoppingCart size={13} /> Add to cart
                </button>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
