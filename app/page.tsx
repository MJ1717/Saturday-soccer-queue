import { supabase } from "@/lib/supabase";
import QueueForm from "./components/QueueForm";
import QueueRow from "./components/QueueRow";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: queue } = await supabase
    .from("queue_entries")
    .select("id, name, position, cancelled, created_at")
    .order("created_at", { ascending: true });

  const entries = queue ?? [];

  // Assign display rank only to non-cancelled entries, in join order
  let rank = 0;
  const rankMap: Record<string, number> = {};
  for (const e of entries) {
    if (!e.cancelled) {
      rank++;
      rankMap[e.id] = rank;
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-14 sm:py-20">
      <div className="relative mx-auto w-full max-w-md rounded-3xl border border-emerald-950/10 bg-white/85 p-5 shadow-[0_18px_55px_-30px_rgba(16,24,40,0.55)] backdrop-blur sm:p-7">
        <QueueForm />

        {entries.length === 0 ? (
          <p className="mt-12 text-center text-sm text-emerald-900/55">No one in the queue yet.</p>
        ) : (
          <ul className="mt-6 space-y-2.5">
            {entries.map((entry) => (
              <QueueRow
                key={entry.id}
                id={entry.id}
                name={entry.name}
                cancelled={entry.cancelled}
                rank={rankMap[entry.id] ?? null}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
