const CATEGORY_IMAGES: Record<string, string> = {
  Cement:
    "https://cdn.guardian.ng/wp-content/uploads/2024/11/Dangote-cement-712x401.jpg",
  "Iron Rods":
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=82",
  "Sand & Aggregate":
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=82",
  Blocks:
    "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=900&q=82",
  Tiles:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=82",
  Roofing:
    "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=900&q=82",
  Plumbing:
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=82",
  Electrical:
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=82",
  "Doors & Windows":
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=82",
  "Paints & Timber":
    "https://images.unsplash.com/photo-1562259949-a4e1a1b5d9d6?auto=format&fit=crop&w=900&q=82",
  Hardware:
    "https://images.unsplash.com/photo-1581147036324-c1c3a50f4932?auto=format&fit=crop&w=900&q=82",
};

/** Product photography for catalog tiles, with a supplied listing photo taking priority. */
export default function MaterialVisual({
  category,
  className,
  imageUrl,
}: {
  category: string;
  imageUrl?: string | null;
  className?: string;
}) {
  return (
    <img
      src={imageUrl || CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Hardware}
      alt={`${category} building material`}
      className={`object-cover rounded-lg bg-slate-100 ${className || "h-28 w-full"}`}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.src = CATEGORY_IMAGES.Hardware;
      }}
    />
  );
}
