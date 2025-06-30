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
    const response = await axios.get(`${BACKEND_URL}/api/payment_history/${username}`); {  
    };

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error fetching payment History:', error);
    return new Response('Failed to fetch Payment History', { status: 500 });
  }
}





// useEffect(() => {
//     const fetchPayment = async () => {
//       try {
//         const response = await axios.get(`${BACKEND_URL}/api/payment_history/${username}`);
//         setPayments(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       }
//     };

//     fetchPayment();
//   }, [username]);