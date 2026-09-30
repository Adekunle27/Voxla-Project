import { TrendingDown, TrendingUp } from "lucide-react";
import { Material } from "../types";
import { money } from "../utils/format";

export default function PriceTicker({ items }: { items: Material[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-voxla-blueDark">
      <div className="ticker-track flex items-center gap-10 py-3 whitespace-nowrap w-max">
        {doubled.map((m, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0 font-inter">
            <span className="text-xs font-semibold text-white/90">{m.name}</span>
            <span className="text-xs font-bold text-white">{money(m.priceLow)}</span>
            {m.trend !== "flat" && (
              <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${m.trend === "down" ? "text-green-400" : "text-red-400"}`}>
                {m.trend === "down" ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                {m.trend === "down" ? "−" : "+"}{money(m.trendChange)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
