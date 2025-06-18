'use client'
import PaystackBtn from '@components/PayStackButton';
import { useState, useCallback} from 'react';

export default function Checkout() {
  const [paidData, setPaidData] = useState(null);

  return (
    <div className="my-50 p-10">
      <h1 className="text-2xl font-bold">Make Payment</h1>

      {!paidData ? (
        <PaystackBtn
          email="test@example.com"
          amount={5000}
          metadata={{ custom_fields: [{ display_name: 'Payment for item X' }] }}
          onVerified={(data) => setPaidData(data)}
        />
      ) : (
        <div className="mt-5 text-green-600">
          <p>✅ Payment Successful!</p>
          <p>Reference: {paidData}</p>
          {/* Display more payment details as needed */}
        </div>
      )}
    </div>
  );
}