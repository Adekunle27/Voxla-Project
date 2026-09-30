import { useEffect, useState } from "react";
import { api } from "../api/client";
import { money } from "../utils/format";

interface OrderRow {
  id: string;
  reference: string;
  total: number;
  status: string;
  createdAt: string;
  items: { materialName: string; supplierName: string; unitPrice: number; qty: number }[];
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <h2 className="font-montserrat font-extrabold text-2xl text-voxla-ink mb-6">My Orders</h2>
      {loading && <p className="text-voxla-mid font-inter">Loading…</p>}
      {!loading && orders.length === 0 && <p className="text-voxla-mid font-inter">No orders yet — place one from the Price Index.</p>}
      <div className="flex flex-col gap-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-montserrat font-bold text-sm text-voxla-ink">{o.reference}</span>
              <span className="text-xs font-inter font-semibold text-green-600">{o.status}</span>
            </div>
            {o.items.map((it, idx) => (
              <div key={idx} className="text-xs font-inter text-voxla-mid flex justify-between py-0.5">
                <span>{it.materialName} × {it.qty} ({it.supplierName})</span>
                <span>{money(it.unitPrice * it.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between mt-2 pt-2 border-t border-gray-100 font-montserrat font-extrabold text-voxla-blue">
              <span className="text-xs font-inter font-medium text-voxla-mid self-center">Total</span>
              <span>{money(o.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
