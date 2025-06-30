import { NextRequest, NextResponse } from "next/server";

// Simple mapping for demonstration. In a real app, this might come from a database.
const diseaseInfo: Record<
  string,
  { description: string; treatment: string[]; prevention: string[] }
> = {
  "Tomato Late blight": {
    description:
      "Late blight is a serious fungal disease that can rapidly destroy tomato and potato plants, causing dark, water-soaked spots on leaves and stems.",
    treatment: [
      "Remove and destroy all affected plants and leaves immediately. Do not compost.",
      "Apply a targeted copper-based or chlorothalonil-based fungicide.",
      "Improve air circulation by pruning and spacing plants farther apart.",
      "Avoid overhead watering; use a soaker hose at the soil level.",
    ],
    prevention: [
      "Plant certified disease-resistant varieties.",
      "Ensure proper spacing for good air circulation.",
      "Water at the soil level early in the day.",
      "Apply preventive fungicide treatments before symptoms appear, especially in cool, damp weather.",
      "Rotate crops and avoid planting in the same spot where tomatoes or potatoes grew last year.",
      "Remove all plant debris from the garden at the end of the season.",
    ],
  },
  // Add other known diseases here...
};

type Prediction = {
  label: string;
  score: number;
};

/**
 * Generates a marketing description for the produce in the image using Google Gemini.
 * Falls back to a local method if the API call fails.
 */
type ProductDetails = { produce: string; marketingDescription: string };

async function generateProductDetails(imageBase64: string): Promise<ProductDetails> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable not set");
    }

    // Using gemini-pro-vision as it can process images
    const model = "gemini-pro-vision";
    const prompt = `Identify the type of produce in the photo and generate a short, catchy 2-3 sentence product description for an online marketplace. Respond ONLY in valid JSON with this exact shape:\n{ \n  "produce": "<name of produce>",\n  "marketingDescription": "<description>"\n}`;

    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    if (!geminiResp.ok) {
      throw new Error(`Gemini API error: ${await geminiResp.text()}`);
    }

    const geminiJson: any = await geminiResp.json();
    const rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!rawText) {
      throw new Error("No response from Gemini");
    }
    let parsed: ProductDetails;
    try {
      parsed = JSON.parse(rawText) as ProductDetails;
      if (!parsed.produce || !parsed.marketingDescription) {
        throw new Error("Incomplete JSON");
      }
    } catch (_) {
      // Fallback to simple extraction
      parsed = { produce: "Produce", marketingDescription: rawText };
    }
    return parsed;

  } catch (err) {
    console.warn(
      "Gemini generation failed – falling back to local generation",
      err,
    );
    // Fallback: retain previous adjective-based implementation
    const adjectives = [
      "premium", "farm-fresh", "organic", "flavour-packed", "nutritious",
      "crisp", "hand-picked", "garden-grown",
    ];
    const picks = adjectives.sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      produce: "Produce",
      marketingDescription: `Enjoy our ${picks.join(" & ")} produce, harvested at peak ripeness for unbeatable taste and quality. Perfect for elevating every meal with wholesome goodness.`,
    };
  }
}

/**
 * Detects plant disease from an image using a primary (Hugging Face) and fallback (Plant.id) service.
 */
async function detectPlantDisease(
  imageDataUrl: string,
  imageBase64: string,
): Promise<Prediction[] | null> {
  let predictions: Prediction[] | null = null;

  /* =====================================================================
     Primary inference – Hugging Face Inference API
     ===================================================================== */
  try {
    const endpoint = process.env.HF_INFERENCE_ENDPOINT;
    const token = process.env.HF_INFERENCE_TOKEN;
    if (!endpoint || !token) {
      throw new Error("Hugging Face environment variables not set.");
    }

    let attempts = 0;
    while (attempts < 3) {
      const hfResp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inputs: imageDataUrl }), // Model expects data URL
      });

      if (hfResp.ok) {
        const json = await hfResp.json();
        if (Array.isArray(json) && json.length > 0) {
          predictions = json as Prediction[];
          break; // Success, exit loop
        }
      }

      // If model is loading (503), wait and retry
      if (hfResp.status === 503) {
        const retryAfter = parseInt(hfResp.headers.get("Retry-After") ?? "10", 10);
        console.log(`Hugging Face model is loading. Retrying in ${retryAfter}s...`);
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        attempts++;
      } else {
         // For other errors, don't retry, just break and go to fallback
         console.warn(`Hugging Face request failed with status: ${hfResp.status}`);
         break;
      }
    }
  } catch (err) {
    console.warn("Hugging Face inference failed, will try fallback.", err);
  }

  /* =====================================================================
     Fallback – Plant.id Health Assessment API (if primary fails)
     ===================================================================== */
  if (!predictions || predictions.length === 0) {
    console.log("Primary detection failed. Attempting Plant.id fallback...");
    try {
      if (!process.env.PLANT_ID_API_KEY) {
        throw new Error("PLANT_ID_API_KEY environment variable not set.");
      }

      const plantResp = await fetch("https://api.plant.id/v3/health_assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": process.env.PLANT_ID_API_KEY,
        },
        body: JSON.stringify({
          images: [imageBase64], // API expects raw base64 string
          // Add other parameters as needed by the API, e.g., 'latitude', 'longitude'
        }),
      });

      if (!plantResp.ok) {
        throw new Error(`Plant.id API error: ${await plantResp.text()}`);
      }

      const plantJson: any = await plantResp.json();
      const diseases = plantJson?.result?.disease?.suggestions ?? [];
      
      if (diseases.length > 0) {
        // Transform the response to match the Prediction structure
        predictions = diseases.map((d: any) => ({
          label: d.name,
          score: d.probability,
        }));
      }
    } catch (err) {
      console.error("Plant.id fallback failed.", err);
    }
  }

  return predictions;
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image || typeof image !== 'string') {
        return NextResponse.json({ error: "Image data is required." }, { status: 400 });
    }

    // Normalize image data and extract raw base64 string
    const imageDataUrl = image.startsWith("data:")
      ? image
      : `data:image/jpeg;base64,${image}`;
    const imageBase64 = imageDataUrl.split(",")[1];


    // Generate a marketing-focused description using Gemini only
    const { produce, marketingDescription } = await generateProductDetails(imageBase64);

    return NextResponse.json({
      produce,
      marketingDescription,
    });

  } catch (err: any) {
    console.error("An unexpected server error occurred:", err);
    return NextResponse.json(
      { error: err.message || "An internal server error occurred." },
      { status: 500 },
    );
  }
}