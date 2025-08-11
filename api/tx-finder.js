export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, amount, toAddress } = req.body;
  if (!token || !amount) {
    return res.status(400).json({ error: 'Missing token or amount' });
  }

  try {
    const amountInSun = Number(amount) * 1_000_000;
    let start = 0;
    const limit = 50;
    let found = null;

    while (!found) {
      const apiUrl = `https://apilist.tronscan.org/api/transfer?limit=${limit}&start=${start}&sort=-timestamp`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.data || data.data.length === 0) break; // No more transactions

      found = data.data.find(tx => {
        const tokenTypeMatch =
          tx.tokenInfo?.tokenType === token ||
          (token === 'trc10' && tx.tokenInfo?.tokenType === 'trx');

        const amountMatch = Number(tx.amount) === amountInSun;
        const addressMatch = toAddress
          ? tx.transferToAddress?.toLowerCase() === toAddress.toLowerCase()
          : true;

        return tx.contractType === 1 && tokenTypeMatch && amountMatch && addressMatch;
      });

      if (found) break;
      start += limit; // Next page
    }

    if (!found) {
      return res.status(404).json({
       token: token,
       amount: amount,
       error: `Transaction not found for token: ${token}, amount: ${amount}`
      });
    }

    return res.json({
      hash: found.transactionHash,
      amount: Number(found.amount) / 1_000_000, // back to TRX
      fromAddress: found.transferFromAddress,
      toAddress: found.transferToAddress
    });

  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
