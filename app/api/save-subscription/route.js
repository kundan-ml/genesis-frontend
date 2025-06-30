// pages/api/save-subscription.js

import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { subscription, username } = req.body;

    const subscriptionsFile = path.join(process.cwd(), 'subscriptions.json');
    let subscriptions = [];

    try {
      const data = await fs.readFile(subscriptionsFile, 'utf8');
      subscriptions = JSON.parse(data);
    } catch (error) {
      console.error('Error reading subscriptions file:', error);
    }

    // Add new subscription
    subscriptions.push({ subscription, username });

    try {
      await fs.writeFile(subscriptionsFile, JSON.stringify(subscriptions));
      res.status(200).json({ message: 'Subscription saved.' });
    } catch (error) {
      console.error('Error writing subscriptions file:', error);
      res.status(500).json({ error: 'Failed to save subscription.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
