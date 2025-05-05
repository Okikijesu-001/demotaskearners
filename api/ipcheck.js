export default async function handler(req, res) {
  const logs = [];

  const token = req.query.token;
  if (!token) {
    logs.push("No token provided.");
    return res.json({ success: false, debug: logs });
  }

  function decodeToken(t) {
    try {
      const decoded = Buffer.from(t, 'base64').toString();
      logs.push("Decoded token: " + decoded);
      return decoded;
    } catch (err) {
      logs.push("Failed to decode token: " + err.message);
      return "";
    }
  }

  const webhookUrl = decodeToken(token);

  const base = "https://api.bots.business/v1/bots/";
  if (!webhookUrl.startsWith(base) ||
      !webhookUrl.includes("command=%2F") ||
      !webhookUrl.includes("user_id=")) {
    logs.push("Webhook URL does not match expected format.");
    return res.json({ success: false, debug: logs });
  }

  try {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const { ip } = await ipRes.json();
    logs.push("Fetched IP: " + ip);

    const vpnRes = await fetch(`https://ipqualityscore.com/api/json/ip/vN7uu7KJuOb1QIrnGXEBwWaj6ztIFnTb/${ip}`);
    const vpnData = await vpnRes.json();
    logs.push("VPN Check Result: " + JSON.stringify(vpnData));

    if (vpnData.vpn || vpnData.proxy || vpnData.tor) {
      logs.push("VPN/proxy detected.");
      return res.json({ vpn: true, debug: logs });
    }

    const ipInfoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const info = await ipInfoRes.json();
    logs.push("IP-API Info: " + JSON.stringify(info));

    const webhookRes = await fetch(webhookUrl, {
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

    logs.push("Webhook response status: " + webhookRes.status);
    return res.json({ success: true, vpn: false, debug: logs });
  } catch (error) {
    logs.push("Error occurred: " + error.message);
    return res.json({ success: false, debug: logs });
  }
}
