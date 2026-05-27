export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { product } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

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
      system: `You are an expert on Indian manufacturing. Respond ONLY with a raw JSON object. No backticks, no markdown, no code fences, no explanation. Start your response with { and end with }. Use this structure: {"product":"...","isIndian":true,"originCountry":"...","originDetails":"...","indianAlternative":{"name":"...","brand":"...","emoji":"...","availability":"...","priceRange":"..."},"comparison":[{"aspect":"Price","foreign":"...","indian":"..."},{"aspect":"Quality","foreign":"...","indian":"..."},{"aspect":"Support","foreign":"...","indian":"..."},{"aspect":"Jobs","foreign":"...","indian":"..."},{"aspect":"Ecosystem","foreign":"...","indian":"..."}],"economicInsights":[{"title":"...","detail":"..."},{"title":"...","detail":"..."},{"title":"...","detail":"..."}],"gdpImpactScore":75,"makeInIndiaRating":"HIGH"}. If product is Indian set indianAlternative to null and comparison to [].`,
      messages: [{ role: "user", content: `Analyze this product: ${product}` }]
    })
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch[0]);
  res.status(200).json(parsed);
}
