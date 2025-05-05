export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { webhook, ipData } = req.body;

  if (
    !webhook ||
    !webhook.startsWith("https://api.bots.business/v1/bots/") ||
    !webhook.includes("command=%2F") ||
    !webhook.includes("user_id=")
  ) {
    return res.status(400).json({ error: "Invalid webhook URL" });
  }

  try {
    const result = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ipData),
    });

    if (!result.ok) {
      return res.status(500).json({ error: "Failed to send to webhook" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
