import { supabase } from "@/lib/supabase";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name =
    body !== null && typeof body === "object" && "name" in body
      ? (body as { name: unknown }).name
      : undefined;

  if (typeof name !== "string" || name.trim() === "") {
    return Response.json({ error: "Name is required" }, { status: 422 });
  }

  if (name.trim().length > 50) {
    return Response.json(
      { error: "Name must be 50 characters or fewer" },
      { status: 422 }
    );
  }

  const { data, error } = await supabase.rpc("join_queue", {
    player_name: name.trim(),
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ position: data }, { status: 201 });
}
