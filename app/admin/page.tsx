import ResetButton from "./ResetButton";

export default function AdminPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-14 sm:py-20">
      <div className="relative mx-auto w-full max-w-md rounded-3xl border border-rose-950/10 bg-white/88 p-7 shadow-[0_18px_55px_-30px_rgba(16,24,40,0.55)] backdrop-blur sm:p-8">
        <h1 className="mb-8 text-xl font-semibold text-slate-900">Admin</h1>
        <ResetButton />
      </div>
    </main>
  );
}
