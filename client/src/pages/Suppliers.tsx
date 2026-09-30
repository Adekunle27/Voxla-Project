import { useEffect, useState } from "react";
import { Building2, MapPin, Star } from "lucide-react";
import { api } from "../api/client";
import { DirectorySupplier } from "../types";
import VerifiedBadge from "../components/VerifiedBadge";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<DirectorySupplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/suppliers").then((res) => setSuppliers(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-1 h-5 rounded bg-voxla-orange" />
        <h2 className="font-montserrat font-extrabold text-2xl text-voxla-ink">Verified Supplier Directory</h2>
      </div>
      <p className="text-sm mb-7 font-inter text-voxla-mid">
        Every supplier on Voxla is site-verified before listing — no ghost stores, no fake stock.
      </p>

      {loading && <p className="text-center py-16 text-voxla-mid font-inter">Loading suppliers…</p>}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="rounded-xl border border-gray-200 p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-voxla-lightBlue">
                  <Building2 size={18} className="text-voxla-blue" />
                </div>
                {s.verified && <VerifiedBadge small />}
              </div>
              <div>
                <h4 className="font-montserrat font-bold text-sm text-voxla-ink">{s.name}</h4>
                <p className="text-xs flex items-center gap-1 mt-0.5 font-inter text-voxla-mid">
                  <MapPin size={12} /> {s.city} · {s.yearsActive} yrs on Voxla
                </p>
              </div>
              <p className="text-xs font-inter text-voxla-slate">{s.categories}</p>
              <div className="flex items-center gap-1 text-xs font-inter font-semibold text-voxla-orange">
                <Star size={13} className="fill-voxla-orange text-voxla-orange" /> {s.rating.toFixed(1)} rating
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
