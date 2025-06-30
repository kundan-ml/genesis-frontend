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
    const response = await axios.get(`${BACKEND_URL}/api/get_profile/${username}`); {  
    };

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response('Failed to fetch profile', { status: 500 });
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
//     const { rows } = await query('SELECT * FROM userpannel_ProfileDetail WHERE username = $1', [username]);
//     return new Response(JSON.stringify({ users: rows }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }



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
//     const { rows } = await query('SELECT * FROM userpannel_ProfileDetail WHERE username = $1', [username]);
    
//     if (rows.length === 0) {
//       return new Response(JSON.stringify({ error: 'User not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const user = rows[0];
//     const formattedUser = {
//       credit: user.credit,
//       name: user.name,
//       email: user.email,
//       username: user.username,
//       photo: user.photo,
//     };

//     return new Response(JSON.stringify(formattedUser), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     return new Response(JSON.stringify({ error: 'Failed to fetch user' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }
