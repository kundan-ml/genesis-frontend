'use client'
// components/ProtectedRoute.js
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../authContext'; // Adjust the path as per your context location

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  return <>{isLoggedIn ? children : null}</>;
};

export default ProtectedRoute;
