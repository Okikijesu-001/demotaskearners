export default async function handler(req, res) {
  const { ip } = req.query;

  const response = await fetch(`https://ipqualityscore.com/api/json/ip/vN7uu7KJuOb1QIrnGXEBwWaj6ztIFnTb/${ip}`);
  const data = await response.json();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    fraud_score: data.fraud_score,
    vpn: data.vpn,
    proxy: data.proxy,
    tor: data.tor,
    isp: data.ISP,
    org: data.organization,
    region: data.region,
    timezone: data.timezone
  });
}
