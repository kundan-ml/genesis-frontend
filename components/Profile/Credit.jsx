import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PROMISE_KEY);

const Credit = ({ profile, darkTheme }) => {
  const [purchaseAmount, setPurchaseAmount] = useState(100);
  const [purchaseCredit, setPurchaseCredit] = useState((purchaseAmount ).toFixed(2));
  const [purchaseImgCount, setPurchaseImgCount] = useState(Math.floor(purchaseCredit * 4));
  const username = profile.username;
  const BACKEND_URL = process.env.BACKEND_URL;
  useEffect(() => {
    const newPurchaseCredit = (purchaseAmount ).toFixed(2);
    setPurchaseCredit(newPurchaseCredit);
    setPurchaseImgCount(Math.floor(newPurchaseCredit * 4));
  }, [purchaseAmount]);

  const handlePurchase = async () => {
    const stripe = await stripePromise;
    try {
      const response = await axios.post(`${BACKEND_URL}/api/create-checkout-session/`, { purchaseAmount, username });
      const sessionId = response.data.sessionId;
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/purchase-credit/`, { purchaseAmount, username });
      console.log(response.data); // Log success message
      // Optionally update profile state or show success message
    } catch (error) {
      console.error('Error purchasing credit:', error);
      // Handle error state if needed
    }
  };

  return (
    <div className={`h-auto w-1/3 min-w-72 mx-auto sm:mx-0   sm:px-8 px-2 py-4 my-10 float-left dark:bg-neutral-800 dark:border-gray-700  bg-white  border shadow-lg rounded`}>
      <span className='font-semibold text-xl'>Credits</span>
      <div className='flex'>
        <span className='sm:text-2xl lg:text-2xl text-xl font-bold text-purple-600 my-4'>{parseFloat(profile.credit).toFixed(2)}</span>
        {/* <span className='text-2xl font-bold text-purple-600 my-4'>{parseFloat(profile.credit).toFixed(2)}</span> */}
        <span className='right-0 justify-end ml-auto my-auto text-sm'>~ {Math.floor(profile.credit * 4)} images</span>
      </div>

      <span className='font-semibold'>Purchase Credits</span>
      <div className='flex'>
        <div className='relative flex items-center mt-2'>
          <span className='absolute p-2'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path d="M6.375 5.5h.875v1.75h-.875a.875.875 0 1 1 0-1.75ZM8.75 10.5V8.75h.875a.875.875 0 0 1 0 1.75H8.75Z" />
              <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM7.25 3.75a.75.75 0 0 1 1.5 0V4h2.5a.75.75 0 0 1 0 1.5h-2.5v1.75h.875a2.375 2.375 0 1 1 0 4.75H8.75v.25a.75.75 0 0 1-1.5 0V12h-2.5a.75.75 0 0 1 0-1.5h2.5V8.75h-.875a2.375 2.375 0 1 1 0-4.75h.875v-.25Z" clipRule="evenodd" />
            </svg>
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg> */}
          </span>
          <input
            type="text"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(parseFloat(e.target.value))}
            className={`block w-full py-1 dark:bg-neutral-900 dark:text-gray-700 dark:border-gray-600 dark:focus:border-blue-300 focus:border-blue-400 focus:ring-blue-300 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200  rounded pl-11 pr-5 rtl:pr-11 rtl:pl-5  focus:outline-none focus:ring focus:ring-opacity-40`}
          />
          <button
            onClick={handlePurchase}
            className="px-2 text-m font-normal ml-1 py-1 rounded tracking-wide text-white capitalize transition-colors duration-300 transform bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring focus:ring-purple-300 focus:ring-opacity-80"
          >
            Buy
          </button>
        </div>
      </div>
      <div className='flex flex-col'>
        <span className='text-normal font-bold ml-auto my-2'>{purchaseCredit} Credits</span>
        <span className='right-0 justify-end ml-auto text-sm'>~ {purchaseImgCount} images</span>
      </div>
    </div>
  );
};

export default Credit;
