'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/auth';
import axios from 'axios';
import Link from 'next/link'
import Credit from './Credit'
import PromptHistory from './PromptHistory';
import Card from './Card';
import PaymentHistoryCard from '@/components/Profile/PaymentHistoryCard';
import PaymentList from './PaymentList';

const Profile = ( { darkTheme } ) => {
  const [profile, setProfile] = useState([]);
  const { username, logout } = useAuth();
  const [payments, setPayments] = useState([]);
  const BACKEND_URL = process.env.BACKEND_URL
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const response = await axios.get(`/api/get-profile?username=${username}`);
        const response = await axios.get(`${BACKEND_URL}/api/get_profile/${username}`);
        setProfile(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [username]);



  useEffect(() => {
    const fetchPayment = async () => {
      try {
        // const response = await axios.get(`/api/payment-history?username=${username}`);
        const response = await axios.get(`${BACKEND_URL}/api/payment_history/${username}`);
        setPayments(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchPayment();
  }, [username]);

  return (
    <section className='h-auto w-auto sm:pt-20 pt-40 sm:mx-20 sm:px-20 px-4 ' >
      <div className='h-auto w-auto sm:mx-10 sm:px-10 ' >
        <h1 className=' font-semibold text-3xl ' >Account</h1>
        <span>Manage your account and billing information</span>

        <div className='h-auto w-auto flex flex-wrap py-6' >
          <div className='flex' >
            <img
              src={profile.photo ? `${profile.photo}` : 'images/profile.png'}
              className="h-20 w-20 my-auto rounded-full"
              alt=""
            />


            <div className='my-auto mx-4' >
              <h2 className=' font-bold text-xl ' >
                {profile.name || 'username' }
                {/* username */}
              </h2>
              <span className=' text-sm ' >
                {profile.email || 'example@gmail.com'  }
              </span>
            </div>

          </div>
          <div className=' ml-auto flex flex-col ' >
            <Link href='login'
              onClick={logout}
              className='text-sm my-0 border-none text-purple-600 font-bold '
            >
              Logout
            </Link>

            <Link href={"/contact"}
              className='text-sm my-1 text-purple-600 font-bold '>
              Contact Us
            </Link>

            <Link href={"/billing"}
              className='text-sm my-1 text-purple-600 font-bold '>
              Billing Guide
            </Link>

            <Link href={"/tutorial"}
              className='text-sm my-1 text-purple-600 font-bold '>
              Prompt Guide
            </Link>
          </div>
        </div>

        <div className='h-auto w-auto flex flex-wrap' >
          <Credit profile={profile}  darkTheme={darkTheme} />
          {/* <PaymentList profile={profile} /> */}

          <div className={`h-72 overflow-y-scroll scrollbar-dark w-3/6 min-w-72 text-xs   mx-auto sm:ml-auto sm:mx-0 sm:px-8 px-2 py-4 my-10 float-left dark:bg-neutral-800 dark:border-gray-700 bg-white  border shadow-lg rounded`}>
            <table className={`min-w-full py-4 my-0 dark:bg-neutral-800 dark:border-gray-700 bg-white  `}>
              <thead className="" >
                <tr className="" >
                  <th className={`py-1 px-2 border-b-2 dark:border-gray-700  border-gray-300  text-left leading-tight`}>Date</th>
                  <th className={`py-1 px-2 border-b-2 dark:border-gray-700  border-gray-300  text-center leading-tight`}>Credit Amount</th>
                  <th className={`py-1 px-2 border-b-2 dark:border-gray-700  border-gray-300  text-end leading-tight`}>Payment Method</th>
                </tr>
              </thead>
              <tbody >

                {payments.map((payment, index) => (
                  <PaymentList key={index} payment={payment} darkTheme={darkTheme} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <PromptHistory darkTheme={darkTheme} />
        
      </div>
    </section>
  )
}

export default Profile