// pages/api/getprofile/route.js
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL;

export default async function handler(req, res) {
  const { username } = req.query;

  try {
    const response = await axios.get(`${BACKEND_URL}/api/get_profile/${username}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}
