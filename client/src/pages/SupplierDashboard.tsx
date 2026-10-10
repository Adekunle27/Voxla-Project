import { useEffect, useState } from "react";
import { Upload, Plus, Eye, EyeOff } from "lucide-react";
import { api } from "../api/client";
import { SupplierListing } from "../types";
import MaterialVisual from "../components/MaterialVisual";
import { money } from "../utils/format";

const CATEGORIES = [
  "Cement", "Iron Rods", "Sand & Aggregate", "Blocks", "Tiles",
  "Roofing", "Plumbing", "Electrical", "Doors & Windows", "Paints & Timber", "Hardware",
];

const emptyForm = { category: CATEGORIES[0], name: "", spec: "", description: "", unit: "bag", price: "", stock: "", deliveryDays: "2" };
type SupplierOrder = { orderItemId: string; materialName: string; unitPrice: number; qty: number; fulfillmentStatus: string; trackingCode: string | null; reference: string; deliveryAddress: string; deliveryCity: string; deliveryPhone: string; preferredDeliveryDate: string | null; createdAt: string; buyerName: string };
const FULFILLMENT_STATUSES = ["PENDING", "ACCEPTED", "PREPARING", "DISPATCHED", "DELIVERED", "CANCELLED"];

export default function SupplierDashboard() {
  const [listings, setListings] = useState<SupplierListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[]>([]);
  const [orderError, setOrderError] = useState("");

  function loadListings() {
    setLoading(true);
    api
      .get("/supplier/listings")
      .then((res) => setListings(res.data))
      .finally(() => setLoading(false));
  }

  function loadSupplierOrders() {
    api.get("/supplier/orders").then((res) => setSupplierOrders(res.data)).catch((err) => setOrderError(err?.response?.data?.error || "Could not load orders."));
  }

  useEffect(() => {
    loadListings();
    loadSupplierOrders();
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const up = await api.post("/uploads/image", fd);
        imageUrl = up.data.url;
      }
      const payload: Record<string, unknown> = {
        category: form.category,
        name: form.name,
        spec: form.spec,
        description: form.description,
        unit: form.unit,
        price: Number(form.price),
        stock: Number(form.stock),
        deliveryDays: Number(form.deliveryDays),
      };
      if (imageUrl) payload.imageUrl = imageUrl;

      if (editingId) {
        await api.patch(`/supplier/listings/${editingId}`, payload);
      } else {
        await api.post("/supplier/listings", payload);
      }
      resetForm();
      loadListings();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Could not save this listing.");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(l: SupplierListing) {
    setEditingId(l.id);
    setForm({
      category: l.categoryName,
      name: l.name,
      spec: l.spec,
      description: l.description,
      unit: l.unit,
      price: String(l.price),
      stock: String(l.stock),
      deliveryDays: String(l.deliveryDays),
    });
    setImagePreview(l.imageUrl);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleActive(l: SupplierListing) {
    await api.patch(`/supplier/listings/${l.id}`, { active: !l.active });
    loadListings();
  }

  async function updateOrder(order: SupplierOrder, fulfillmentStatus: string) {
    setOrderError("");
    try {
      await api.patch(`/supplier/orders/${order.orderItemId}`, { fulfillmentStatus, trackingCode: order.trackingCode || undefined });
      loadSupplierOrders();
    } catch (err: any) { setOrderError(err?.response?.data?.error || "Could not update this order."); }
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="font-montserrat font-extrabold text-2xl text-voxla-ink mb-1">Supplier Dashboard</h2>
      <p className="text-sm font-inter text-voxla-mid mb-8">Post materials for buyers to find, compare, and order directly.</p>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 p-5 mb-10 flex flex-col gap-4">
        <h3 className="font-montserrat font-bold text-sm text-voxla-ink">{editingId ? "Edit listing" : "Post a new material"}</h3>
        {error && <p className="text-xs font-inter text-red-600">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            required
            placeholder="Material name (e.g. Dangote Cement 42.5N)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter"
          />
          <textarea
            required
            placeholder="Product description — condition, best use, and key benefits"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter sm:col-span-2 min-h-24"
          />
          <input
            required
            placeholder="Spec (e.g. 50kg bag, OPC)"
            value={form.spec}
            onChange={(e) => setForm({ ...form, spec: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter"
          />
          <input
            required
            placeholder="Unit (e.g. bag, piece, tipper)"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter"
          />
          <input
            required
            type="number"
            min="1"
            placeholder="Price (NGN)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter"
          />
          <input
            required
            type="number"
            min="0"
            placeholder="Stock available"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter"
          />
          <input
            required
            type="number"
            min="0"
            placeholder="Delivery days"
            value={form.deliveryDays}
            onChange={(e) => setForm({ ...form, deliveryDays: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-inter"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-inter font-semibold text-voxla-blue border border-voxla-blue rounded-lg px-3 py-2 cursor-pointer">
            <Upload size={15} /> {imageFile || imagePreview ? "Change photo" : "Add photo"}
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
          {imagePreview && <img src={imagePreview} className="w-14 h-14 rounded-lg object-cover border border-gray-200" />}
          <span className="text-[11px] font-inter text-voxla-mid">JPG/PNG, up to 2MB</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={submitting}
            className="rounded-lg py-2.5 px-5 text-sm font-inter font-bold text-white bg-voxla-orange disabled:opacity-50 flex items-center gap-1.5"
          >
            <Plus size={15} /> {submitting ? "Saving…" : editingId ? "Save changes" : "Post material"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-sm font-inter font-semibold text-voxla-mid">
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="mb-10">
        <div className="flex items-end justify-between mb-4"><div><h3 className="font-montserrat font-bold text-lg text-voxla-ink">Incoming orders</h3><p className="text-xs text-voxla-mid mt-1">Update each line as you accept, prepare, and dispatch it.</p></div><span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-voxla-orange">{supplierOrders.filter((order) => order.fulfillmentStatus === "PENDING").length} new</span></div>
        {orderError && <p className="mb-3 text-xs text-red-600">{orderError}</p>}
        {supplierOrders.length === 0 ? <p className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-voxla-mid">New buyer orders will appear here.</p> : <div className="flex flex-col gap-3">{supplierOrders.map((order) => <article key={order.orderItemId} className="rounded-xl border border-gray-200 bg-white p-4"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-montserrat font-bold text-sm text-voxla-ink">{order.materialName} × {order.qty}</p><p className="text-xs text-voxla-mid mt-1">{order.reference} · {order.buyerName} · {money(order.unitPrice * order.qty)}</p><p className="text-xs text-voxla-mid mt-1">Deliver to: {order.deliveryAddress}, {order.deliveryCity} · {order.deliveryPhone}</p>{order.preferredDeliveryDate && <p className="text-xs text-voxla-mid mt-1">Preferred date: {order.preferredDeliveryDate}</p>}</div><div className="min-w-40"><label className="text-[11px] font-bold text-voxla-mid">TRACKING CODE</label><input value={order.trackingCode || ""} onChange={(e) => setSupplierOrders((current) => current.map((item) => item.orderItemId === order.orderItemId ? { ...item, trackingCode: e.target.value } : item))} onBlur={() => updateOrder(order, order.fulfillmentStatus)} placeholder="Optional tracking code" className="mt-1 block w-full border border-gray-300 rounded-lg px-2 py-2 text-xs" /><label className="block mt-2 text-[11px] font-bold text-voxla-mid">FULFILLMENT</label><select value={order.fulfillmentStatus} onChange={(e) => updateOrder(order, e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-2 py-2 text-xs font-bold text-voxla-blue">{FULFILLMENT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></div></div></article>)}</div>}
      </section>

      <h3 className="font-montserrat font-bold text-lg text-voxla-ink mb-4">Your Listings</h3>
      {loading && <p className="text-voxla-mid font-inter text-sm">Loading…</p>}
      {!loading && listings.length === 0 && <p className="text-voxla-mid font-inter text-sm">You haven't posted any materials yet.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((l) => (
          <div key={l.id} className={`rounded-xl border border-gray-200 p-3 flex flex-col gap-2 ${!l.active ? "opacity-50" : ""}`}>
            <MaterialVisual category={l.categoryName} imageUrl={l.imageUrl} className="h-24 w-full" />
            <div>
              <h4 className="font-montserrat font-bold text-sm text-voxla-ink">{l.name}</h4>
              <p className="text-xs font-inter text-voxla-mid">{l.spec}</p>
            </div>
            <div className="font-montserrat font-extrabold text-voxla-blue">
              {money(l.price)}<span className="text-xs font-inter text-voxla-mid font-normal"> /{l.unit}</span>
            </div>
            <p className="text-xs font-inter text-voxla-mid">{l.stock} in stock · {l.deliveryDays}d delivery{!l.active && " · Unlisted"}</p>
            <div className="flex gap-2 mt-1">
              <button onClick={() => startEdit(l)} className="flex-1 text-xs font-inter font-bold rounded-lg py-1.5 border border-voxla-blue text-voxla-blue">
                Edit
              </button>
              <button
                onClick={() => toggleActive(l)}
                className="flex-1 text-xs font-inter font-bold rounded-lg py-1.5 border border-gray-300 text-voxla-slate flex items-center justify-center gap-1"
              >
                {l.active ? <><EyeOff size={12} /> Unlist</> : <><Eye size={12} /> Relist</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
