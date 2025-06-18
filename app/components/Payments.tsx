'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer} from 'recharts';

import { useUser }from '@utils/user';
import { months } from '@utils/date';
import { useDarkMode } from '@lib/DarkModeProvider';
import { MoreHorizontal,Banknote} from 'lucide-react';

interface PaymentProps {
    data: any[];
    isLoading: boolean;
    admin?:boolean;
}

const Payments = ({data,isLoading,admin}: PaymentProps) => {

// const {data,isLoading} = useGetAgentPayments({userId,enabled:!!userId})
const {darkMode} = useDarkMode()
const mappedData = data?.map((item:any) => {
  return {

    month: months[item._id.month -1],
    Amount: item.totalAmount,
  }})


if(isLoading) {
    return (
    <div className='flex items-center gap-1 font-semibold text-gray-700 dark:text-white'>
 <span>
    Loading Payments
</span>
 <MoreHorizontal size={30} color={darkMode ? 'white' : 'gray'} 
 className='animate-pulse'/>
    </div>
    )
}

if(mappedData?.length < 1) {
    return (
    <div className="bg-whit w-full h-40 p-2 pt-4 pb-10 rounded-2xl shadow otherCard">
      <h2 className="text-xl font-semibold subheading">Payments - Last 6 Months</h2>
     <div className='flex flex-col md:mt-6 md:gap-2 md:flex-row items-center pb-10'>
     <Banknote size={40} color={darkMode ? '#32CD32' :'#228B22'}/>
      <div className="dark:text-white text-lg font-medium">
  {admin ? `Agents haven't made a payment in the past six months` : 
  `You haven't made a payment in the past six months`}
        </div>
        </div>
        </div>
    )
}
  return (
    <div className="w-full h-96 p-2 pt-4 pb-10 rounded-2xl shadow otherCard">
      <h2 className="text-xl font-semibold subheading">Payments - Last 6 Months</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mappedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="yellow" stopOpacity={0.8} />
              <stop offset="95%" stopColor="yellow" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
        tick={{ fill: `${darkMode ? 'white' : '#555'}`, fontSize: 16 }}
          dataKey="month" />
          <YAxis 
            stroke="#555"
          tick={{ fill: `${darkMode ? 'white' : '#555'}`, fontSize: 16 }}
          tickLine={{ stroke: '#aaa' }} 
          tickFormatter={(value) => `₦${value / 1000}k`} />
          <Tooltip 
    contentStyle={{background: `${darkMode? '#2B2B2B' : '#fff'}`, color: `${darkMode? '#fff' : '#111'}`}}
          formatter={(value: number) => `₦${value.toLocaleString()}`} />
          <Area
            type="monotone"
            dataKey="Amount"
            stroke={`${darkMode ? 'white' : '#555'}`}
            fillOpacity={1}
            fill='rgba(242,152,41,0.8)'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


export default Payments