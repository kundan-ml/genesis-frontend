import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Og5RPSIkW6NwioHqVt77DP2TGB3CfAwCMxwUZcZNdrNiDY6bZ5KzaU7mmw5AdyINCN75h8mnf5DoPPWvDUgU3Rd00dnfq46Aq');

const PaymentList = ({ payment, darkTheme }) => {
    const { date, amount, description } = payment;

  return (

    
      <tr>
        <td className={`py-2 px-2 border-b  dark:border-gray-700 border-gray-200 `}>{new Date(payment.created_at).toLocaleString()}</td>
        <td className={`py-2 px-4 border-b text-center  dark:border-gray-700 border-gray-200 `}>${payment.payment}</td>
        <td className={`py-2 px-2 border-b text-end  dark:border-gray-700 border-gray-200 `}>{payment.payment_method}</td>
      </tr>

      // {/* <!-- Add more rows as needed --> */}
    // </tbody>
 

  );
};

export default PaymentList;
