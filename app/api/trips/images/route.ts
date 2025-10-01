import { NextResponse } from "next/server";

type UnsplashPhoto = {
    id: string;
    description: string | null;
    alt_description: string | null;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    links: {
        html: string;
    };
    user: {
        name: string;
        links: { html: string };
    };
};

export async function GET(req: Request) {
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    if (!UNSPLASH_ACCESS_KEY) {
        return NextResponse.json(
            { error: "Missing UNSPLASH_ACCESS_KEY in environment" },
            { status: 500 }
        );
    }

    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "landscape";
    let per_page = parseInt(url.searchParams.get("per_page") || "10", 10);
    if (Number.isNaN(per_page) || per_page <= 0) per_page = 10;
    per_page = Math.min(per_page, 30); // Unsplash max per_page is 30

    const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
    )}&per_page=${per_page}`;

    try {
        const res = await fetch(apiUrl, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json(
                { error: "Unsplash API error", status: res.status, details: text },
                { status: 502 }
            );
        }

        const data = await res.json();
        const results: UnsplashPhoto[] = Array.isArray(data.results)
            ? data.results
            : [];

        // Return a trimmed payload to the client
        const images = results.map((p) => ({
            id: p.id,
            description: p.description,
            alt_description: p.alt_description,
            url: p.urls.regular,
            link: p.links?.html,
            author: p.user?.name
        }));

        return NextResponse.json(
            images,
            {
                status: 200,
                headers: {
                    "Cache-Control": "public, max-age=300", // 5 minutes
                },
            }
        );
    } catch (err) {
        return NextResponse.json(
            { error: "Unexpected error fetching images", details: String(err) },
            { status: 500 }
        );
    }
}