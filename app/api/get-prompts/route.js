import axios from 'axios';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const BACKEND_URL = process.env.BACKEND_URL
  if (!username) {
    return new Response('Username is required', { status: 400 });
  }

  try {
    // Replace BACKEND_URL with your actual backend URL
    const response = await axios.get(`${BACKEND_URL}/api/prompts/${username}`);{  
    };

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error fetching Prompt:', error);
    return new Response('Failed to fetch Prompt', { status: 500 });
  }
}
