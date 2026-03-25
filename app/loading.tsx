import Navbar from "@/components/Navbar";
import RecentOffersSkeleton from "@/components/RecentOffersSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#f4f4f4]">
      <Navbar />
      <main>
        <div className="relative min-h-[40vh] animate-pulse bg-zinc-300 md:aspect-[16/7] md:min-h-0" />
        <div className="space-y-5 px-[max(1rem,env(safe-area-inset-left))] py-5 pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 lg:px-10">
          <section className="mx-auto h-40 max-w-[1600px] animate-pulse rounded-2xl bg-zinc-200" />
          <RecentOffersSkeleton />
        </div>
      </main>
    </div>
  );
}
