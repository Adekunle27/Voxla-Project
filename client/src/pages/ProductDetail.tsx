import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, ShoppingCart, Star, Truck } from "lucide-react";
import { api } from "../api/client";
import { Material, SupplierOption } from "../types";
import MaterialVisual from "../components/MaterialVisual";
import TrendTag from "../components/TrendTag";
import VerifiedBadge from "../components/VerifiedBadge";
import { money } from "../utils/format";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [material, setMaterial] = useState<Material | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([api.get(`/materials/${id}`), api.get(`/materials/${id}/suppliers`)])
      .then(([product, offers]) => { setMaterial(product.data); setSuppliers(offers.data.suppliers); })
      .catch((err) => setError(err?.response?.data?.error || "This product could not be found."))
      .finally(() => setLoading(false));
  }, [id]);

  function addOffer(supplier: SupplierOption) {
    if (!material) return;
    addItem({ materialId: material.id, materialName: material.name, supplierId: supplier.supplierId, supplierName: supplier.name, price: supplier.price, unit: material.unit, qty: 1 });
    setAdded(supplier.priceId);
  }

  if (loading) return <p className="py-24 text-center text-sm text-voxla-mid">Loading product...</p>;
  if (error || !material) return <section className="max-w-5xl mx-auto px-4 py-20 text-center"><h1 className="font-montserrat font-extrabold text-2xl text-voxla-ink">Product unavailable</h1><p className="text-sm text-voxla-mid mt-2">{error}</p><Link to="/materials" className="inline-block mt-6 text-sm font-bold text-voxla-blue">Back to catalog</Link></section>;

  return <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <Link to="/materials" className="inline-flex items-center gap-1.5 text-sm font-bold text-voxla-blue mb-6"><ArrowLeft size={16} /> Back to catalog</Link>
    <div className="grid lg:grid-cols-[1fr_1.05fr] gap-8 lg:gap-12">
      <MaterialVisual category={material.category} imageUrl={material.imageUrl} className="w-full h-72 sm:h-[430px] rounded-2xl" />
      <div><span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-orange-50 text-voxla-orange">{material.category}</span><h1 className="font-montserrat font-extrabold text-3xl sm:text-4xl leading-tight text-voxla-ink mt-3">{material.name}</h1><p className="text-base text-voxla-slate mt-2">{material.spec}</p><div className="mt-5"><span className="font-montserrat font-extrabold text-2xl text-voxla-blue">{money(material.priceLow)}</span><span className="font-montserrat font-bold text-lg text-voxla-mid"> – {money(material.priceHigh)}</span><span className="text-sm text-voxla-mid"> / {material.unit}</span></div><div className="mt-2"><TrendTag trend={material.trend} change={material.trendChange} /></div><div className="mt-7 pt-6 border-t border-slate-200"><h2 className="font-montserrat font-bold text-lg text-voxla-ink">About this product</h2><p className="text-sm leading-7 text-voxla-slate mt-2">{material.description || `${material.name} — ${material.spec}. Contact a supplier below for availability and delivery details.`}</p></div></div>
    </div>
    <div className="mt-12"><div className="flex items-end justify-between gap-4 mb-5"><div><h2 className="font-montserrat font-extrabold text-2xl text-voxla-ink">Choose a supplier</h2><p className="text-sm text-voxla-mid mt-1">Compare current prices, stock, and delivery before adding to cart.</p></div><span className="text-xs font-bold text-voxla-mid">{suppliers.length} offers</span></div><div className="grid md:grid-cols-2 gap-4">{suppliers.map((supplier) => <article key={supplier.priceId} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex justify-between gap-3"><div><div className="flex items-center gap-1.5 flex-wrap"><h3 className="font-montserrat font-bold text-base text-voxla-ink">{supplier.name}</h3>{supplier.verified && <VerifiedBadge small />}</div><p className="flex items-center gap-1 mt-2 text-xs text-voxla-mid"><MapPin size={13} /> {supplier.city} <Star size={13} className="ml-2 fill-voxla-orange text-voxla-orange" /> {supplier.rating || "New"}</p></div><div className="text-right"><div className="font-montserrat font-extrabold text-lg text-voxla-blue">{money(supplier.price)}</div><span className="text-[11px] text-voxla-mid">per {material.unit}</span></div></div><div className="flex items-center gap-1 mt-4 text-xs text-voxla-mid"><Truck size={14} /> {supplier.stock} in stock · {supplier.deliveryDays} day delivery</div><button onClick={() => addOffer(supplier)} className="w-full mt-4 rounded-lg py-2.5 text-sm font-bold text-white bg-voxla-orange flex justify-center items-center gap-1.5"><ShoppingCart size={15} /> {added === supplier.priceId ? "Added to cart" : "Add to cart"}</button></article>)}</div></div>
  </section>;
}
