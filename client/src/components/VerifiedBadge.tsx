import { ShieldCheck } from "lucide-react";

export default function VerifiedBadge({ small }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-inter font-semibold bg-voxla-lightBlue text-voxla-blue ${
        small ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"
      }`}
    >
      <ShieldCheck size={small ? 11 : 13} /> Verified
    </span>
  );
}
