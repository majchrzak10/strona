"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = { typ: "sprzedaz" | "wynajem" };

export default function LegacyNieruchomosciRedirect({ typ }: Props) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/nieruchomosci/?typ=${typ}`);
  }, [router, typ]);
  return (
    <p className="py-16 text-center text-sm text-zinc-600" role="status">
      Przekierowanie…
    </p>
  );
}
