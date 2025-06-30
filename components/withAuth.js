'use client';
// components/withAuth.js
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../utils/auth';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
      if (!user) {
        router.replace('/login');
      }
    }, [user]);

    if (!user) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
