import axios from 'axios';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const anomalyId = searchParams.get('anomalyid');
  const BACKEND_URL = process.env.BACKEND_URL;

  if (!anomalyId) {
    return new Response('Anomaly id is required', { status: 400 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/anomaly/fetch-anomaly/?prompt=${anomalyId}`);
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






// import { query } from '@/lib/db'; // Assuming you have set up a `query` function for PostgreSQL

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const anomalyId = searchParams.get('anomalyid');

//   if (!anomalyId) {
//     return new Response(JSON.stringify({ error: 'Anomaly ID is required' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     // Fetch the anomaly details from the anomaly_Anomaly table
//     const anomalyQuery = `
//       SELECT id, model, created_at, num_images, fail_img, pass_img
//       FROM anomaly_Anomaly
//       WHERE id = $1
//     `;
//     const anomalyResult = await query(anomalyQuery, [anomalyId]);

//     if (anomalyResult.rows.length === 0) {
//       return new Response(JSON.stringify({ error: 'Anomaly not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const anomaly = anomalyResult.rows[0];

//     // Fetch associated images from the anomaly_AnomalyImageGen table, ordered by created_at descending
//     const imageQuery = `
//       SELECT id, unique_code, image_name, result, anomaly_score, model, 
//              raw_image, colormap_image, overlapped_image, created_at
//       FROM anomaly_AnomalyImageGen
//       WHERE anomaly_id = $1
//       ORDER BY created_at DESC
//     `;
//     const imageResult = await query(imageQuery, [anomalyId]);

//     const response_data = {};

//     imageResult.rows.forEach(entry => {
//       response_data[entry.image_name] = {
//         model: entry.model,
//         image_name: entry.image_name,
//         raw_image: entry.raw_image,
//         colormap_image: entry.colormap_image,
//         overlapped_image: entry.overlapped_image,
//         result: entry.result,
//         anomaly_score: entry.anomaly_score,
//       };
//     });

//     return new Response(JSON.stringify(response_data), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching anomaly:', error);
//     return new Response(JSON.stringify({ error: 'Failed to fetch anomaly' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }
