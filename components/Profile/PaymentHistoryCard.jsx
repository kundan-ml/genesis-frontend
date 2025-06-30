import React from 'react';

const PaymentHistoryCard = ({ payment }) => {
  const { date, amount, description } = payment; // Destructure payment object

  return (
    <div className="flex flex-col   items-center justify-center bg-white border border-gray-300 shadow-lg rounded-lg p-4 w-72">
      <p className="text-lg font-semibold mb-2">{new Date(payment.created_at).toLocaleString()}</p>
      <p className="text-2xl text-green-600 font-bold mb-2">${payment.payment}</p>
      <p className="text-sm text-end text-gray-500">{payment.username} ({payment.payment_method}) </p>
    </div>
  );
};

export default PaymentHistoryCard;
