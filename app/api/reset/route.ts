import { supabase } from "@/lib/supabase";

export async function POST() {
  const { error } = await supabase
    .from("queue_entries")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
