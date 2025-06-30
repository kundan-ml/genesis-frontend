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
    const response = await axios.get(`${BACKEND_URL}/anomaly/history/${username}`); {  
    };

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error fetching Anomaly History:', error);
    return new Response('Failed to fetch Anomaly History', { status: 500 });
  }
}

// import { query } from '@/lib/db';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const username = searchParams.get('username');

//   if (!username) {
//     return new Response(JSON.stringify({ error: 'Username is required' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     // Step 1: Fetch the user id from auth_user using the username
//     const userQuery = 'SELECT id FROM auth_user WHERE username = $1';
//     const userResult = await query(userQuery, [username]);

//     if (userResult.rows.length === 0) {
//       return new Response(JSON.stringify({ error: 'User not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const userId = userResult.rows[0].id;

//     // Step 2: Fetch anomalies and their associated images using the user id, sorted by created_at
//     const anomaliesQuery = `
//       SELECT a.id, a.model, a.created_at, a.num_images, a.fail_img, a.pass_img,
//              ai.id AS image_id, ai.unique_code, ai.image_name, ai.result,
//              ai.anomaly_score, ai.model AS image_model, ai.raw_image,
//              ai.colormap_image, ai.overlapped_image, ai.created_at AS image_created_at
//       FROM anomaly_Anomaly a
//       JOIN anomaly_AnomalyImageGen ai ON ai.anomaly_id = a.id
//       WHERE a.user_id = $1
//       ORDER BY a.created_at DESC, ai.created_at DESC;
//     `;

//     const { rows } = await query(anomaliesQuery, [userId]);

//     // Organize the data into the desired format
//     const anomalies = {};
    
//     rows.forEach(row => {
//       const anomalyId = row.id;

//       if (!anomalies[anomalyId]) {
//         anomalies[anomalyId] = {
//           id: row.id,
//           model: row.model,
//           created_at: row.created_at,
//           num_images: row.num_images,
//           fail_img: row.fail_img,
//           pass_img: row.pass_img,
//           images: []
//         };
//       }

//       anomalies[anomalyId].images.push({
//         id: row.image_id,
//         unique_code: row.unique_code,
//         image_name: row.image_name,
//         result: row.result,
//         anomaly_score: row.anomaly_score,
//         model: row.image_model,
//         raw_image: row.raw_image,
//         colormap_image: row.colormap_image,
//         overlapped_image: row.overlapped_image,
//         created_at: row.image_created_at,
//       });
//     });

//     // Convert the anomalies object to an array and sort by created_at date (newest first)
//     const sortedAnomalies = Object.values(anomalies).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//     return new Response(JSON.stringify(sortedAnomalies), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }