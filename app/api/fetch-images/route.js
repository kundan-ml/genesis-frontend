import axios from 'axios';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const promptId = searchParams.get('promptId');
  const BACKEND_URL = process.env.BACKEND_URL;

  if (!promptId) {
    return new Response('prompt id is required', { status: 400 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/fetch-images/?prompt=${promptId}`);
    const data = await response.json();  // Parse the response body as JSON

    if (!response.ok) {
      return new Response('Failed to fetch Anomaly', { status: response.status });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error fetching Anomaly:', error);
    return new Response('Failed to fetch Anomaly', { status: 500 });
  }
}

