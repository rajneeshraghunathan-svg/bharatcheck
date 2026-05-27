export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { product } = req.body;

  if (!product) {
    return res.status(400).json({ error: "No product provided" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: `You are an expert on Indian manufacturing and Make in India. Respond ONLY with valid JSON — no markdown, no backticks, no explanation. Use exactly this structure: {"product":"...","isIndian":true,"originCountry":"...","originDetails":"...","indianAlternative":{"name":"...","brand":"...","emoji":"...","availability":"...","priceRange":"..."},"comparison":[{"aspect":"Price","foreign":"...","indian":"..."},{"aspect":"Quality","foreign":"...","indian":"..."},{"aspect":"Support","foreign":"...","indian":"..."},{"aspect":"Jobs","foreign":"...","indian":"..."},{"aspect":"Ecosystem","foreign":"...","indian":"..."}],"economicInsights":[{"title":"...","detail":"..."},{"title":"...","detail":"..."},{"title":"...","detail":"..."}],"gdpImpactScore":75,"makeInIndiaRating":"HIGH"}. If product is Indian set indianAlternative to null and comparison to [].`,
        messages: [{ role: "user", content: `Analyze this product: ${product}` }]
      })
    });

    const rawText = await response.text();
    console.log("Anthropic raw response:", rawText);

    const data = JSON.parse(rawText);

    if (data.error) {
      console.error("Anthropic API error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

const text = data.content?.map(b => b.text || "").join("") || "";
console.log("Raw text from Claude:", text);

// Aggressively extract JSON object
const jsonMatch = text.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  return res.status(500).json({ error: "No JSON found in response" });
}

const parsed = JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("Handler error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
