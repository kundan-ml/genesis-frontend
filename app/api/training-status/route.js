// pages/api/training-status.js
export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/train/training-status`);
        const data = await response.json();
        
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch training status' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  