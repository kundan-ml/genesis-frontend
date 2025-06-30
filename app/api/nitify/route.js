// pages/api/notify.js

import webpush from 'web-push';
import { promises as fs } from 'fs';
import path from 'path';

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const subscriptionsFile = path.join(process.cwd(), 'subscriptions.json');
    let subscriptions = [];

    try {
      const data = await fs.readFile(subscriptionsFile, 'utf8');
      subscriptions = JSON.parse(data);
    } catch (error) {
      console.error('Error reading subscriptions file:', error);
    }

    const { payload, username } = req.body;

    const userSubscriptions = subscriptions.filter(sub => sub.username === username);

    const notificationPromises = userSubscriptions.map(sub => {
      return webpush.sendNotification(sub.subscription, JSON.stringify(payload))
        .catch(error => {
          console.error('Error sending notification', error);
        });
    });

    try {
      await Promise.all(notificationPromises);
      res.status(200).json({ message: 'Notifications sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error sending notifications' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
