export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <div className="glass h-80 animate-pulse rounded-2xl" />
        <div className="glass h-80 animate-pulse rounded-2xl" />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass h-40 animate-pulse rounded-2xl" />
        ))}
      </div>
    </main>
  );
}
