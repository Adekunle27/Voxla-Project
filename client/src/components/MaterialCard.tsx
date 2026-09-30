import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Material } from "../types";
import { money } from "../utils/format";
import TrendTag from "./TrendTag";
import MaterialVisual from "./MaterialVisual";

export default function MaterialCard({ m, onCompare }: { m: Material; onCompare: (m: Material) => void }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/materials/${m.id}`)} className="rounded-xl border border-gray-200 bg-white p-3 flex flex-col gap-3 transition-shadow hover:shadow-lg cursor-pointer">
      <MaterialVisual category={m.category} imageUrl={m.imageUrl} className="h-28 w-full" />
      <span className="text-[10px] font-inter font-bold tracking-wide uppercase px-2 py-1 rounded text-voxla-orange bg-orange-50 w-fit">
        {m.category}
      </span>
      <div>
        <h4 className="font-montserrat font-bold text-[15px] leading-snug text-voxla-ink">{m.name}</h4>
        <p className="text-xs mt-0.5 font-inter text-voxla-mid">{m.spec} · {m.supplierCount} {m.supplierCount === 1 ? "supplier" : "suppliers"}</p>
      </div>
      <div>
        <div className="font-montserrat font-extrabold text-xl text-voxla-blue">
          {money(m.priceLow)}<span className="text-sm font-semibold text-voxla-mid"> – {money(m.priceHigh)}</span>
        </div>
        <div className="text-[11px] mb-1 font-inter text-voxla-mid">per {m.unit}</div>
        <TrendTag trend={m.trend} change={m.trendChange} />
      </div>
      <button
        onClick={(event) => { event.stopPropagation(); onCompare(m); }}
        className="mt-1 w-full rounded-lg py-2.5 text-sm font-inter font-bold text-white bg-voxla-orange flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98]"
      >
        Compare Suppliers <ArrowRight size={15} />
      </button>
    </div>
  );
}
