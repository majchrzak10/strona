"use client";

import ContactFormSection from "@/components/ContactFormSection";
import SectionErrorBoundary from "@/components/SectionErrorBoundary";

export default function ContactFormWithBoundary() {
  return (
    <SectionErrorBoundary
      fallback={
        <section className="w-full" aria-live="polite">
          <div className="mx-auto max-w-[1600px] px-4 py-12">
            <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-8 text-center text-sm text-amber-950">
              Formularz chwilowo niedostępny. Zadzwoń:{" "}
              <a href="tel:501769166" className="font-semibold text-brand-primary underline">
                501 769 166
              </a>
              .
            </div>
          </div>
        </section>
      }
    >
      <ContactFormSection />
    </SectionErrorBoundary>
  );
}
