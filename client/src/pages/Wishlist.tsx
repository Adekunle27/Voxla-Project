import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import MaterialVisual from "../components/MaterialVisual";
import { useFavorites } from "../context/FavoritesContext";
import { money } from "../utils/format";

export default function Wishlist() {
  const { items, toggle } = useFavorites();
  return <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12"><h1 className="font-montserrat font-extrabold text-3xl text-voxla-ink">Saved products</h1><p className="text-sm text-voxla-mid mt-2 mb-7">Keep material options handy while planning your project.</p>{items.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center"><Heart size={28} className="mx-auto text-voxla-orange" /><p className="font-semibold text-voxla-ink mt-3">No saved products yet</p><Link to="/materials" className="inline-block mt-3 text-sm font-bold text-voxla-blue">Browse materials</Link></div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{items.map((material) => <article key={material.id} className="rounded-xl overflow-hidden border border-slate-200 bg-white"><Link to={`/materials/${material.id}`}><MaterialVisual category={material.category} imageUrl={material.imageUrl} className="h-32 w-full rounded-none" /></Link><div className="p-3"><p className="text-[10px] font-bold uppercase text-voxla-orange">{material.category}</p><Link to={`/materials/${material.id}`} className="block font-montserrat font-bold text-sm text-voxla-ink mt-1">{material.name}</Link><p className="text-sm font-bold text-voxla-blue mt-3">{money(material.priceLow)} / {material.unit}</p><button onClick={() => toggle(material)} className="mt-3 text-xs font-bold text-red-600">Remove</button></div></article>)}</div>}</section>;
}
