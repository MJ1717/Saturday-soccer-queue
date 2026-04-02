"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleReset() {
    if (!confirm("Reset the queue? This cannot be undone.")) return;
    setLoading(true);
    setDone(false);

    const res = await fetch("/api/reset", { method: "POST" });

    setLoading(false);
    if (res.ok) {
      setDone(true);
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={handleReset}
        disabled={loading}
        className="w-full rounded-xl bg-rose-600 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Resetting…" : "Reset Queue"}
      </button>
      {done && (
        <p className="text-center text-sm font-medium text-emerald-700">Queue cleared.</p>
      )}
    </div>
  );
}
