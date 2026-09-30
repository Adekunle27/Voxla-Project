export default function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg viewBox="0 0 40 40" className="w-8 h-8 shrink-0">
        <path d="M4 6 H36 L36 20 C36 30 28 36 20 38 C12 36 4 30 4 20 Z" fill="#1E3A8A" />
        <path d="M11 12 L20 22 L29 12" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 26 C15 30 25 30 27 26 C24 29 16 29 13 26 Z" fill="#F97316" />
      </svg>
      <span className="font-montserrat font-extrabold tracking-tight text-lg text-white leading-none">VOXLA</span>
    </div>
  );
}
