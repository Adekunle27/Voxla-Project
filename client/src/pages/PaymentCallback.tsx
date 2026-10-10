import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";
import { money } from "../utils/format";

export default function PaymentCallback() {
  const [params] = useSearchParams(); const reference = params.get("reference");
  const [state, setState] = useState<"loading" | "success" | "failed">("loading"); const [message, setMessage] = useState(""); const [order, setOrder] = useState<{ reference: string; total: number } | null>(null); const { clear } = useCart();
  useEffect(() => { if (!reference) { setState("failed"); setMessage("Missing payment reference."); return; } api.get(`/orders/paystack/verify/${encodeURIComponent(reference)}`).then((res) => { setOrder(res.data.order); clear(); setState("success"); }).catch((err) => { setMessage(err?.response?.data?.error || "We could not confirm this payment."); setState("failed"); }); }, [reference, clear]);
  return <section className="max-w-md mx-auto px-4 py-24 text-center">{state === "loading" ? <><div className="mx-auto w-8 h-8 rounded-full border-4 border-voxla-orange border-t-transparent animate-spin" /><h1 className="font-montserrat font-extrabold text-2xl text-voxla-ink mt-5">Confirming your payment</h1><p className="text-sm text-voxla-mid mt-2">Please do not close this page.</p></> : state === "success" ? <><CheckCircle2 size={54} className="mx-auto text-emerald-600" /><h1 className="font-montserrat font-extrabold text-2xl text-voxla-ink mt-4">Payment confirmed</h1><p className="text-sm text-voxla-mid mt-2">Order {order?.reference} has been paid successfully.</p><p className="font-montserrat font-extrabold text-2xl text-voxla-blue mt-4">{order && money(order.total)}</p><Link to="/orders" className="inline-block mt-7 rounded-lg px-5 py-2.5 text-sm font-bold text-white bg-voxla-blue">Track my order</Link></> : <><XCircle size={54} className="mx-auto text-red-600" /><h1 className="font-montserrat font-extrabold text-2xl text-voxla-ink mt-4">Payment not confirmed</h1><p className="text-sm text-voxla-mid mt-2">{message}</p><Link to="/materials" className="inline-block mt-7 text-sm font-bold text-voxla-blue">Return to catalog</Link></>}</section>;
}
