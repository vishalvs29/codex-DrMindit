export default function Loading() {
  return (
    <main className="min-h-screen bg-aurora-grid px-4 pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="h-10 w-48 animate-pulse rounded-full bg-white/10" />
        <div className="mt-6 h-24 max-w-3xl animate-pulse rounded-2xl bg-white/10" />
        <div className="mt-4 h-32 max-w-2xl animate-pulse rounded-2xl bg-white/10" />
      </div>
    </main>
  );
}
