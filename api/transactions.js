// api/transactions.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://apilist.tronscan.org/api/transaction?sort=-timestamp&limit=20');
    const data = await response.json();

    const transactions = data.data.map(tx => ({
      amount: tx.amount / 1e6, // Convert from SUN to TRX
      from: tx.ownerAddress,
      to: tx.toAddress,
    }));

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}
