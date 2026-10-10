import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Search, ShieldCheck, XCircle } from "lucide-react";
import { api } from "../api/client";
import { AdminSupplier } from "../types";

export default function AdminSupplierVerification() {
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get("/admin/suppliers").then((res) => setSuppliers(res.data)).catch((err) => setError(err?.response?.data?.error || "Could not load supplier accounts.")).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => suppliers.filter((supplier) => `${supplier.name} ${supplier.city} ${supplier.email}`.toLowerCase().includes(query.toLowerCase())), [suppliers, query]);
  const pending = suppliers.filter((supplier) => !supplier.verified).length;

  async function updateVerification(supplier: AdminSupplier, verified: boolean) {
    setUpdatingId(supplier.id);
    setError("");
    try {
      const note = notes[supplier.id] ?? supplier.verificationNote ?? "";
      await api.patch(`/admin/suppliers/${supplier.id}/verification`, { verified, note });
      setSuppliers((current) => current.map((item) => item.id === supplier.id ? { ...item, verified, verificationNote: note } : item));
    } catch (err: any) {
      setError(err?.response?.data?.error || "The verification update could not be saved.");
    } finally { setUpdatingId(null); }
  }

  return <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <div className="flex flex-col sm:flex-row gap-5 sm:items-end sm:justify-between mb-8">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-voxla-orange">Admin workspace</p><h1 className="font-montserrat font-extrabold text-3xl text-voxla-ink mt-1">Supplier verification</h1><p className="text-sm text-voxla-mid mt-2">Review registered businesses and control their marketplace verification badge.</p></div>
      <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3 min-w-[155px]"><div className="text-2xl font-montserrat font-extrabold text-voxla-orange">{pending}</div><div className="text-xs font-semibold text-voxla-slate">awaiting review</div></div>
    </div>
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"><h2 className="font-montserrat font-bold text-base text-voxla-ink">Registered suppliers</h2><label className="relative"><Search size={15} className="absolute left-3 top-2.5 text-voxla-mid" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search business or email" className="border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none w-full sm:w-64" /></label></div>
      {error && <p className="mx-4 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? <p className="py-16 text-center text-sm text-voxla-mid">Loading supplier accounts...</p> : filtered.length === 0 ? <p className="py-16 text-center text-sm text-voxla-mid">No supplier accounts match this search.</p> : <div className="divide-y divide-slate-100">{filtered.map((supplier) => <article key={supplier.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-montserrat font-bold text-base text-voxla-ink">{supplier.name}</h3>{supplier.verified ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 size={12} /> Verified</span> : <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700"><Clock3 size={12} /> Pending review</span>}</div><p className="text-sm text-voxla-mid mt-1">{supplier.contactName} · {supplier.email}</p><p className="text-xs text-voxla-mid mt-1">{supplier.city} · Joined {new Date(supplier.createdAt).toLocaleDateString()}</p></div>
        <div className="flex flex-col gap-2 shrink-0 min-w-56"><input value={notes[supplier.id] ?? supplier.verificationNote ?? ""} onChange={(e) => setNotes({ ...notes, [supplier.id]: e.target.value })} placeholder="Review note (optional)" className="border border-slate-200 rounded-lg px-3 py-2 text-xs" />{supplier.verified ? <button disabled={updatingId === supplier.id} onClick={() => updateVerification(supplier, false)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-50"><XCircle size={14} /> Remove badge</button> : <button disabled={updatingId === supplier.id} onClick={() => updateVerification(supplier, true)} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-voxla-blue px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><ShieldCheck size={14} /> {updatingId === supplier.id ? "Saving..." : "Verify supplier"}</button>}</div>
      </article>)}</div>}
    </div>
  </section>;
}
