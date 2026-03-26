import Link from "next/link";

export default function FooterLegalLinks() {
  return (
    <div className="text-center text-xs text-white/45">
      <Link
        href="/polityka-prywatnosci/"
        className="font-medium text-white/60 underline decoration-white/25 underline-offset-[3px] transition-colors hover:text-white"
      >
        Polityka prywatności
      </Link>
    </div>
  );
}
