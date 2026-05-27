export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { product } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are an expert on Indian manufacturing and Make in India. Respond ONLY with valid JSON — no markdown, no preamble. Structure: {"product":"...","isIndian":true/false,"originCountry":"...","originDetails":"...","indianAlternative":{"name":"...","brand":"...","emoji":"...","availability":"...","priceRange":"..."},"comparison":[{"aspect":"...","foreign":"...","indian":"..."}],"economicInsights":[{"title":"...","detail":"..."}],"gdpImpactScore":50,"makeInIndiaRating":"HIGH/MEDIUM/LOW"}. If product is Indian set indianAlternative to null and comparison to [].`,
      messages: [{ role: "user", content: `Product: ${product}` }]
    })
  });

  const data = await response.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();

  res.status(200).json(JSON.parse(clean));
}
