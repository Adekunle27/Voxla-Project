import { TrendingDown, TrendingUp } from "lucide-react";
import { money } from "../utils/format";

export default function TrendTag({ trend, change }: { trend: string; change: number }) {
  if (trend === "flat" || !change) {
    return <span className="text-xs font-inter font-medium text-voxla-mid">Stable this week</span>;
  }
  const down = trend === "down";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-inter font-semibold ${down ? "text-green-600" : "text-red-600"}`}>
      {down ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
      {money(change)} {down ? "cheaper" : "pricier"} than last week
    </span>
  );
}
