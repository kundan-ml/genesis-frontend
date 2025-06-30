'use client';
import React from 'react'
import useAuthRedirect from '@/utils/useAuthRedirect';
const Protected = () => {
  const { token } = useAuthRedirect();
  return (
    <div>Protected</div>
  )
}

export default Protected