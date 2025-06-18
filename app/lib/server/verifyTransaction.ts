import axios from "axios";

export const verifyTransaction = async (reference: string) => {
  try {
    const res = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    throw new Error('Verification failed');
  }
};
