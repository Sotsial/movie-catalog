import { searchMovies } from "@/lib/omdbService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const s = searchParams.get("s");
  const page = searchParams.get("page");

  if (!s) {
    return NextResponse.json(
      { Error: "Search query is required" },
      { status: 400 }
    );
  }

  const params = {
    s,
    page: page || "1",
  };

  try {
    const results = await searchMovies(params);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { Error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
