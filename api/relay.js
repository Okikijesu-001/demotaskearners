export const config = {
  api: {
    bodyParser: true, // Required to parse JSON body
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { webhook, data } = req.body;

  if (!webhook || typeof webhook !== "string" || !webhook.startsWith("https://api.bots.business/")) {
    return res.status(400).json({ error: "Invalid or missing webhook URL" });
  }

  try {
    const forwardRes = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 (compatible; MyBot/1.0; +https://vercel.com)" },
      body: JSON.stringify(data),
    });

    const text = await forwardRes.text(); // Capture response from Telegram API
    console.log("✅ Sent to webhook:", webhook);
    console.log("📤 Data:", data);
    console.log("📥 Response:", text);

    if (!forwardRes.ok) {
      return res.status(forwardRes.status).json({ error: text });
    }

    return res.status(200).json({ success: true, response: text });
  } catch (err) {
    console.error("❌ Relay Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
