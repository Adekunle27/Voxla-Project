import { useState } from "react";
import { X, Lock, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { money } from "../utils/format";
import { useNavigate } from "react-router-dom";

type Step = "cart" | "checkout";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, total, checkout } = useCart();
  const { user } = useAuth(); const navigate = useNavigate();
  const [step, setStep] = useState<Step>("cart"); const [paying, setPaying] = useState(false); const [error, setError] = useState("");
  const [delivery, setDelivery] = useState({ address: "", city: "", phone: "", preferredDate: "" });
  const deliveryFee = 2500 * new Set(items.map((item) => item.supplierId)).size;
  const deliveryValid = delivery.address.trim().length > 4 && delivery.city.trim().length > 1 && delivery.phone.trim().length > 5;
  if (!open) return null;
  function close() { setStep("cart"); setError(""); onClose(); }
  async function pay() {
    if (!user) { close(); navigate("/login"); return; }
    if (!deliveryValid) { setError("Enter your delivery address, city, and phone number."); return; }
    setPaying(true); setError("");
    try { const payment = await checkout(delivery); window.location.assign(payment.authorizationUrl); }
    catch (err: any) { setError(err?.response?.data?.error || "Could not start Paystack payment."); setPaying(false); }
  }
  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50"><div className="bg-white w-full sm:w-[420px] h-full overflow-y-auto flex flex-col"><div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-200"><h3 className="font-montserrat font-extrabold text-lg text-voxla-ink">{step === "cart" ? "Your Cart" : "Checkout"}</h3><button onClick={close} className="p-1.5 rounded-full hover:bg-gray-100"><X size={18} className="text-voxla-slate" /></button></div>
    {step === "cart" ? <div className="flex-1 flex flex-col p-5 gap-3">{items.length === 0 ? <p className="text-sm text-center mt-10 text-voxla-mid">Your cart is empty. Add materials from the catalog to get started.</p> : <>{items.map((item, index) => <div key={index} className="flex items-center justify-between border border-gray-200 rounded-lg p-3"><div><div className="font-montserrat font-bold text-sm text-voxla-ink">{item.materialName}</div><div className="text-xs text-voxla-mid">{item.supplierName} · {money(item.price)}/{item.unit} × {item.qty}</div></div><button onClick={() => removeItem(index)} className="text-xs font-semibold text-red-600">Remove</button></div>)}<div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between"><span className="text-voxla-mid text-sm font-medium">Items total</span><span className="font-montserrat font-extrabold text-xl text-voxla-blue">{money(total)}</span></div><button onClick={() => setStep("checkout")} className="w-full rounded-lg py-3 text-sm font-bold text-white bg-voxla-orange">Continue to checkout</button></>}</div> : <div className="flex-1 flex flex-col p-5 gap-4"><div className="rounded-xl p-4 text-white bg-gradient-to-br from-voxla-blue to-voxla-blueDark"><div className="flex items-center gap-2"><Lock size={15} /><span className="font-montserrat font-bold text-sm">Secure payment by Paystack</span></div><p className="text-xs text-white/70 mt-2">You will complete payment on Paystack's secure checkout.</p></div><div className="flex flex-col gap-3"><h4 className="font-montserrat font-bold text-sm text-voxla-ink">Delivery details</h4><input placeholder="Delivery address" value={delivery.address} onChange={(e) => setDelivery({ ...delivery, address: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none" /><div className="flex gap-3"><input placeholder="City" value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none w-1/2" /><input placeholder="Phone number" value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none w-1/2" /></div><label className="text-xs text-voxla-mid">Preferred delivery date (optional)<input type="date" value={delivery.preferredDate} onChange={(e) => setDelivery({ ...delivery, preferredDate: e.target.value })} className="block mt-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none w-full" /></label></div>{error && <p className="text-xs text-red-600">{error}</p>}<div className="mt-auto pt-4 border-t border-gray-200"><div className="flex justify-between text-sm text-voxla-mid"><span>Items</span><span>{money(total)}</span></div><div className="flex justify-between text-sm text-voxla-mid mt-2"><span>Delivery</span><span>{money(deliveryFee)}</span></div><div className="flex justify-between mt-3 font-montserrat font-extrabold text-xl text-voxla-blue"><span>Total</span><span>{money(total + deliveryFee)}</span></div></div><button disabled={!deliveryValid || paying} onClick={pay} className="w-full rounded-lg py-3 text-sm font-bold text-white bg-voxla-orange flex items-center justify-center gap-2 disabled:opacity-40"><CreditCard size={16} /> {paying ? "Opening Paystack..." : `Pay ${money(total + deliveryFee)}`}</button></div>}
  </div></div>;
}
