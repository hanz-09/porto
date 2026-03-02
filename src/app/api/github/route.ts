import { NextResponse } from "next/server";

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
  private: boolean;
}

export async function GET() {
  const username = process.env.GITHUB_USERNAME;

  if (!username) {
    return NextResponse.json(
      { error: "GITHUB_USERNAME not set in .env.local" },
      { status: 500 }
    );
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`,
      {
        headers,
        next: { revalidate: 60 }, // cache for 60 seconds — refresh every minute
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}`, detail: err },
        { status: res.status }
      );
    }

    const repos: GithubRepo[] = await res.json();

    // Filter: no forks, no private, has a description
    const filtered = repos
      .filter((r) => !r.fork && !r.private)
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description ?? "No description provided.",
        html_url: r.html_url,
        homepage: r.homepage ?? null,
        topics: r.topics ?? [],
        language: r.language ?? null,
        stars: r.stargazers_count,
        updatedAt: r.updated_at,
      }));

    return NextResponse.json(filtered);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
