import { NextRequest, NextResponse } from "next/server";

/**
 * Generate a short (2-3 sentence) marketing description for the given product
 * using Google Gemini. Falls back to an adjective-based description locally
 * if the API call fails or the environment variable is missing.
 */
async function generateMarketingDescription(product: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable not set");
    }

    const model = "gemini-pro"; // text-only model is enough here
    const prompt = `Write a catchy 2-3 sentence description to sell fresh ${product}. Highlight freshness, flavour, and quality. Do not mention AI.`;

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    if (!resp.ok) {
      throw new Error(`Gemini API error: ${await resp.text()}`);
    }

    const json: any = await resp.json();
    const description = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!description) {
      throw new Error("No description returned by Gemini");
    }
    return description;
  } catch (err) {
    console.warn("Gemini failed, falling back to local generation", err);
    const adjectives = [
      "premium",
      "farm-fresh",
      "organic",
      "flavour-packed",
      "nutritious",
      "crisp",
      "hand-picked",
      "garden-grown",
    ];
    const picks = adjectives.sort(() => 0.5 - Math.random()).slice(0, 2);
    return `Enjoy our ${picks.join(" & ")} ${product}, harvested at peak ripeness for unbeatable taste and quality. Perfect for elevating every meal with wholesome goodness.`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { product } = await req.json();
    if (!product || typeof product !== "string") {
      return NextResponse.json({ error: "'product' field is required" }, { status: 400 });
    }

    const marketingDescription = await generateMarketingDescription(product);
    return NextResponse.json({ marketingDescription });
  } catch (err: any) {
    console.error("Marketing API error", err);
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
