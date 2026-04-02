import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("queue_entries")
    .select("id, name, position, created_at")
    .order("position", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ queue: data });
}
