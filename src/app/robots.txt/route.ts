// src/app/sitemap.xml/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  // Example: fetch  product slugs from your DB
  // const products = await db.product.findMany({ select: { slug: true } });

  const urls = [
    { loc: "https://soukelmeuble.tn/", priority: 1.0 },
    // ...products.map((p) => ({ loc: `https://soukelmeuble.tn/${p.slug}` })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
