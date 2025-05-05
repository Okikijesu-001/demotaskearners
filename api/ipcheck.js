export default async function handler(req, res) {
  const token = req.query.token;
  if (!token) return res.json({ success: false });

  function decodeToken(t) {
    try {
      return decodeURIComponent(atob(t));
    } catch {
      return "";
    }
  }

  const webhookUrl = decodeToken(token);
  const base = "https://api.bots.business/v1/bots/";
  if (!webhookUrl.startsWith(base) ||
      !webhookUrl.includes("command=%2Fhey") ||
      !webhookUrl.includes("bot_id=1803545")) {
    return res.json({ success: false });
  }

  // Get user IP
  const ipRes = await fetch("https://api.ipify.org?format=json");
  const { ip } = await ipRes.json();

  // VPN check (via IPQualityScore)
  const vpnRes = await fetch(`https://ipqualityscore.com/api/json/ip/vN7uu7KJuOb1QIrnGXEBwWaj6ztIFnTb/${ip}`);
  const vpnData = await vpnRes.json();

  if (vpnData.vpn || vpnData.proxy || vpnData.tor) {
    return res.json({ vpn: true });
  }

  // IP data (ip-api)
  const ipInfoRes = await fetch(`http://ip-api.com/json/${ip}`);
  const info = await ipInfoRes.json();

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ip,
      country: info.country,
      region: info.regionName,
      city: info.city,
      isp: info.isp,
      org: info.org,
      mobile: info.mobile,
      timezone: info.timezone
    })
  });

  return res.json({ success: true, vpn: false });
}
