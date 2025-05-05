export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { webhook, payload } = req.body;

  if (!webhook || !payload) {
    return res.status(400).json({ error: "Missing webhook or payload" });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; VercelBot/1.0)"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    return res.status(200).json({ success: true, response: text });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to send to webhook",
      message: err.message
    });
  }
}
