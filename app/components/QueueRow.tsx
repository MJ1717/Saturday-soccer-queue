"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  name: string;
  rank: number | null;
  cancelled: boolean;
};

export default function QueueRow({ id, name, rank, cancelled }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    await fetch("/api/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLoading(false);
    router.refresh();
  }

  async function handleRestore() {
    setLoading(true);
    await fetch("/api/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLoading(false);
    router.refresh();
  }

  if (cancelled) {
    return (
      <li className="flex items-center gap-3 rounded-2xl border border-red-400/60 bg-red-100/85 px-4 py-3.5 text-[15px] font-medium text-red-950">
        <span className="w-8 shrink-0 rounded-full bg-white/60 py-1 text-center font-mono text-xs opacity-60">
          —
        </span>
        <span className="flex-1 truncate line-through opacity-60">{name}</span>
        <button
          onClick={handleRestore}
          disabled={loading}
          aria-label="Restore"
          className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/70 text-red-700 transition hover:bg-white disabled:opacity-40"
        >
          ✓
        </button>
      </li>
    );
  }

  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-[15px] font-medium ${
        rank !== null && rank <= 24
          ? "border-emerald-300/70 bg-emerald-100/80 text-emerald-950"
          : "border-amber-300/70 bg-amber-100/85 text-amber-950"
      }`}
    >
      <span className="w-8 shrink-0 rounded-full bg-white/80 py-1 text-center font-mono text-xs opacity-80">
        {rank}
      </span>
      <span className="flex-1 truncate">{name}</span>
      <button
        onClick={handleCancel}
        disabled={loading}
        aria-label="Cancel"
        className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/70 text-current opacity-50 transition hover:opacity-100 disabled:opacity-30"
      >
        ✕
      </button>
    </li>
  );
}
