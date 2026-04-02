import { supabase } from "@/lib/supabase";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const id =
    body !== null && typeof body === "object" && "id" in body
      ? (body as { id: unknown }).id
      : undefined;

  if (typeof id !== "string" || id.trim() === "") {
    return Response.json({ error: "id is required" }, { status: 422 });
  }

  const { error } = await supabase
    .from("queue_entries")
    .update({ cancelled: true })
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
