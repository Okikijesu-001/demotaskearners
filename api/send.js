export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { webhook, payload } = req.body;
  if (!webhook || !payload) return res.status(400).json({ error: "Missing data" });

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    res.json({ success: true, response: text });
  } catch (err) {
    res.status(500).json({ error: "Webhook failed", details: err.message });
  }
}
