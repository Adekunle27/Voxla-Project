import { useState } from "react";
import { X, Lock, CreditCard, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { money } from "../utils/format";
import { OrderResult } from "../types";
import { useNavigate } from "react-router-dom";

type Step = "cart" | "pay" | "success";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("cart");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [card, setCard] = useState({ num: "", exp: "", cvv: "", name: "" });
  const [delivery, setDelivery] = useState({ address: "", city: "", phone: "", preferredDate: "" });
  const { checkout } = useCart();

  const cardValid = card.num.replace(/\s/g, "").length >= 12 && card.exp.length >= 4 && card.cvv.length >= 3 && card.name.trim().length > 1;
  const deliveryValid = delivery.address.trim().length > 4 && delivery.city.trim().length > 1 && delivery.phone.trim().length > 5;
  const deliveryFee = 2500 * new Set(items.map((item) => item.supplierId)).size;

  if (!open) return null;

  function handleClose() {
    setStep("cart");
    setError("");
    onClose();
  }

  async function handlePay() {
    if (!user) {
      handleClose();
      navigate("/login");
      return;
    }
    setPaying(true);
    setError("");
    try {
      // small artificial delay so the VoxlaPay "processing" state is visible
      if (!deliveryValid) {
        setError("Please enter your delivery address, city, and phone number.");
        return;
      }
      const [order] = await Promise.all([checkout(delivery), new Promise((r) => setTimeout(r, 900))]);
      setResult(order);
      setStep("success");
    } catch (e: any) {
      setError(e?.response?.data?.error || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50">
      <div className="bg-white w-full sm:w-[420px] h-full overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="font-montserrat font-extrabold text-lg text-voxla-ink">
            {step === "cart" && "Your Cart"}
            {step === "pay" && "Checkout"}
            {step === "success" && "Order Confirmed"}
          </h3>
          <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-gray-100">
            <X size={18} className="text-voxla-slate" />
          </button>
        </div>

        {step === "cart" && (
          <div className="flex-1 flex flex-col p-5 gap-3">
            {items.length === 0 && (
              <p className="text-sm text-center mt-10 font-inter text-voxla-mid">Your cart is empty. Add materials from the Price Index to get started.</p>
            )}
            {items.map((i, idx) => (
              <div key={idx} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                <div>
                  <div className="font-montserrat font-bold text-sm text-voxla-ink">{i.materialName}</div>
                  <div className="text-xs font-inter text-voxla-mid">{i.supplierName} · {money(i.price)}/{i.unit} × {i.qty}</div>
                </div>
                <button onClick={() => removeItem(idx)} className="text-xs font-inter font-semibold text-red-600">Remove</button>
              </div>
            ))}
            {items.length > 0 && (
              <>
                <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="font-inter text-voxla-mid text-sm font-medium">Total</span>
                  <span className="font-montserrat font-extrabold text-xl text-voxla-blue">{money(total)}</span>
                </div>
                <button onClick={() => setStep("pay")} className="w-full rounded-lg py-3 text-sm font-inter font-bold text-white bg-voxla-orange">
                  Proceed to VoxlaPay
                </button>
                {!user && <p className="text-[11px] text-center font-inter text-voxla-mid">You'll be asked to sign in before payment.</p>}
              </>
            )}
          </div>
        )}

        {step === "pay" && (
          <div className="flex-1 flex flex-col p-5 gap-4">
            <div className="rounded-xl p-4 text-white relative overflow-hidden bg-gradient-to-br from-voxla-blue to-voxla-blueDark">
              <div className="flex items-center gap-1.5 mb-6">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-voxla-orange">
                  <Lock size={11} color="#fff" />
                </div>
                <span className="font-montserrat font-extrabold text-sm">
                  Voxla<span className="text-voxla-orange">Pay</span>
                </span>
              </div>
              <div className="font-inter tracking-widest text-lg font-semibold">
                {card.num ? card.num.padEnd(19, "•") : "•••• •••• •••• ••••"}
              </div>
              <div className="flex justify-between mt-4 text-[11px] opacity-80 font-inter">
                <span>{card.name || "CARDHOLDER NAME"}</span>
                <span>{card.exp || "MM/YY"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-montserrat font-bold text-sm text-voxla-ink">Delivery details</p>
              <input placeholder="Delivery address" value={delivery.address} onChange={(e) => setDelivery({ ...delivery, address: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none font-inter" />
              <div className="flex gap-3"><input placeholder="City" value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none w-1/2 font-inter" /><input placeholder="Phone number" value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none w-1/2 font-inter" /></div>
              <input type="date" value={delivery.preferredDate} onChange={(e) => setDelivery({ ...delivery, preferredDate: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none font-inter" />
              <p className="font-montserrat font-bold text-sm text-voxla-ink mt-2">Payment details</p>
              <input
                placeholder="Card number"
                value={card.num}
                onChange={(e) => setCard({ ...card, num: e.target.value.replace(/[^\d ]/g, "").slice(0, 19) })}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none font-inter"
              />
              <input
                placeholder="Cardholder name"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none font-inter"
              />
              <div className="flex gap-3">
                <input
                  placeholder="MM/YY"
                  value={card.exp}
                  onChange={(e) => setCard({ ...card, exp: e.target.value.slice(0, 5) })}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none w-1/2 font-inter"
                />
                <input
                  placeholder="CVV"
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none w-1/2 font-inter"
                />
              </div>
            </div>

            {error && <p className="text-xs font-inter text-red-600">{error}</p>}

            <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="font-inter text-voxla-mid text-sm font-medium">Items + delivery</span>
              <span className="font-montserrat font-extrabold text-xl text-voxla-blue">{money(total + deliveryFee)}</span>
            </div>
            <button
              disabled={!cardValid || !deliveryValid || paying}
              onClick={handlePay}
              className="w-full rounded-lg py-3 text-sm font-inter font-bold text-white bg-voxla-orange flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {paying ? "Processing…" : <>Pay {money(total + deliveryFee)} securely <CreditCard size={15} /></>}
            </button>
            <p className="text-[11px] text-center flex items-center justify-center gap-1 font-inter text-voxla-mid">
              <Lock size={11} /> Simulated payment — order is created for real on the server, no real money moves.
            </p>
          </div>
        )}

        {step === "success" && result && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-voxla-lightBlue">
              <Check size={30} className="text-voxla-blue" />
            </div>
            <h4 className="font-montserrat font-extrabold text-xl text-voxla-ink">Payment successful</h4>
            <p className="text-sm font-inter text-voxla-mid">
              Order <span className="font-semibold text-voxla-slate">{result.reference}</span> has been placed via VoxlaPay and saved to your account.
            </p>
            <div className="font-montserrat font-extrabold text-2xl mt-2 text-voxla-blue">{money(result.total)}</div>
            <button onClick={handleClose} className="mt-4 rounded-lg px-6 py-2.5 text-sm font-inter font-bold text-white bg-voxla-blue">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
