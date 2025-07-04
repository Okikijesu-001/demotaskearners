export default async function handler(req, res) {
  const { userId, taskId, url } = req.body;

  const webhook = `https://api.bots.business/v1/bots/2008024/new-webhook?&command=%2Fonvisit&public_user_token=8223f21264cbe0d5ec79f8c56893d646&user_id=${userId}`;

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        taskId,
        url
      })
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error sending to bots.business:", err);
    return res.status(500).json({ error: "Failed to send webhook" });
  }
}
