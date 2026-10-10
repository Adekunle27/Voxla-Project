import { useEffect, useState } from "react";
import { MapPin, PackageCheck } from "lucide-react";
import { api } from "../api/client";
import { money } from "../utils/format";

interface OrderRow {
  id: string; reference: string; total: number; deliveryFee: number; status: string; createdAt: string;
  deliveryAddress: string; deliveryCity: string; preferredDeliveryDate: string | null;
  items: { materialName: string; supplierName: string; unitPrice: number; qty: number; fulfillmentStatus: string; trackingCode: string | null }[];
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/orders").then((res) => setOrders(res.data)).finally(() => setLoading(false)); }, []);

  return <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
    <h1 className="font-montserrat font-extrabold text-2xl text-voxla-ink mb-1">My Orders</h1><p className="text-sm text-voxla-mid mb-6">Follow each supplier's preparation and delivery progress.</p>
    {loading && <p className="text-voxla-mid">Loading orders...</p>}
    {!loading && orders.length === 0 && <p className="text-voxla-mid">No orders yet — place one from the catalog.</p>}
    <div className="flex flex-col gap-4">{orders.map((order) => <article key={order.id} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"><div className="flex items-center justify-between gap-3 mb-3"><div><h2 className="font-montserrat font-bold text-sm text-voxla-ink">{order.reference}</h2><p className="text-xs text-voxla-mid mt-1">Placed {new Date(order.createdAt).toLocaleDateString()}</p></div><span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-voxla-blue"><PackageCheck size={12} /> {order.status}</span></div>
      <div className="rounded-lg bg-slate-50 p-3 text-xs text-voxla-slate mb-3"><p className="flex gap-1.5 items-start"><MapPin size={14} className="text-voxla-orange shrink-0" /> {order.deliveryAddress}, {order.deliveryCity}</p>{order.preferredDeliveryDate && <p className="mt-1 pl-5">Preferred delivery: {order.preferredDeliveryDate}</p>}</div>
      <div className="divide-y divide-slate-100">{order.items.map((item, index) => <div key={index} className="py-2 flex justify-between gap-3 text-xs"><div><p className="font-semibold text-voxla-ink">{item.materialName} × {item.qty}</p><p className="text-voxla-mid mt-0.5">{item.supplierName}</p><p className="text-voxla-blue font-bold mt-1">{item.fulfillmentStatus}{item.trackingCode ? ` · Tracking: ${item.trackingCode}` : ""}</p></div><span className="text-voxla-slate">{money(item.unitPrice * item.qty)}</span></div>)}</div>
      <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 font-montserrat font-extrabold text-voxla-blue"><span className="text-xs font-inter font-medium text-voxla-mid self-center">Total incl. {money(order.deliveryFee)} delivery</span><span>{money(order.total)}</span></div>
    </article>)}</div>
  </section>;
}
