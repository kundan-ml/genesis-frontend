// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { parseCookies } from 'nookies';
// import { useAuth } from './auth';

// const useAuthRedirect = () => {
//   const router = useRouter();
//   const { token } = parseCookies();
//   const { username } = useAuth() || {};
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!token || username === undefined) {
//       router.replace('/login');
//     } else {
//       setLoading(false); // Only allow rendering after validation
//     }
//   }, [token, username, router]);

//   return { token, loading };
// };

// export default useAuthRedirect;



'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useAuth } from './auth';

const useAuthRedirect = () => {
  const router = useRouter();
  const { token } = parseCookies();
  const { username } = useAuth() || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || username === undefined) {
      router.replace('/login');
    } else {
      setLoading(false);
    }
  }, [token, username, router]);

  return { token, loading };
};

export default useAuthRedirect;
