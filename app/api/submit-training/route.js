// pages/api/submit-training.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/train/anomaly/`, {
          method: 'POST',
          body: req.body,
        });
  
        if (response.ok) {
          const data = await response.json();
          res.status(200).json(data);
        } else {
          const errorData = await response.json();
          res.status(response.status).json(errorData);
        }
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }
  