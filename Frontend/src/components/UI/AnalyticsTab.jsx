import { DollarSign, Loader, Loader2, Package, ShoppingCart } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import { getAnalyticsData } from '../../API/api';

const AnalyticsTab = () => {
  const { products, totalSales, totalRevenue, analyticsLoading, dailySalesData } = useSelector(
    (state) => state.analyticsData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    getAnalyticsData(dispatch);
  }, [dispatch]);

  if (analyticsLoading) {
    return (
      <div className="flex justify-center ">
      <div className="animate-spin text-white">
        <Loader2 size={40} />
      </div>
    </div>
    );
  }

  return (
    <div className=' mx-auto px-3 sm:px-6 lg:px-8'>
      {/* Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <AnalyticsCard
          title='Total Products'
          value={products?.toLocaleString()}
          icon={Package}
          color=' from-[#381e38] via-[#4f1579] to-[#2e0594]'
        />
        <AnalyticsCard
          title='Total Sales'
          value={totalSales?.toLocaleString()}
          icon={ShoppingCart}
          color='from-emerald-500 to-cyan-700'
        />
        <AnalyticsCard
          title='Total Revenue'
          value={`$${totalRevenue?.toLocaleString()}`}
          icon={DollarSign}
          color='from-emerald-500 to-lime-700'
        />
      </div>

      {/* Recharts Graph */}
      <div className='bg-gradient-to-r from-[#1a0b1f] via-[#2b1a38] to-[#0e0a18]  rounded-2xl py-2 shadow-xl transition-all duration-500'>
        {dailySalesData?.length > 0 ? (
          <ResponsiveContainer width='100%' height={400}>
            <LineChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" />
              <XAxis dataKey='date' tickLine={false} axisLine={false} className='text-xs text-gray-300' />
              <YAxis
                yAxisId='left'
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                domain={[0,7]}
              />
              <YAxis
                yAxisId='right'
                orientation='right'
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-md bg-gray-900 border border-gray-700 p-3 shadow-lg">
                        <p className="text-xs text-gray-400 mb-1">{payload[0].payload.date}</p>
                        <div className="text-sm text-white space-y-1">
                          <div>📦 Sales: <span className="font-semibold">{payload[0].value}</span></div>
                          <div>💰 Revenue: <span className="font-semibold">${payload[1].value}</span></div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ color: '#CBD5E1' }}
                formatter={(value) => (
                  <span className="text-sm text-slate-300">{value}</span>
                )}
              />
              <Line
                yAxisId='left'
                type='monotone'
                dataKey='sales'
                stroke="#10B981"
                strokeWidth={3}
                dot={false}
                name='Sales'
              />
              <Line
                yAxisId='right'
                type='monotone'
                dataKey='revenue'
                stroke="#3B82F6"
                strokeWidth={3}
                dot={false}
                name='Revenue'
                strokeDasharray="4 4"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className='text-center text-gray-400 p-8'>No analytics data available yet.</div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <div className={` rounded-2xl p-6 shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
    <div className='relative z-10'>
      <p className='text-white text-sm font-semibold mb-1'>{title}</p>
      <h3 className='text-white text-3xl font-bold'>{value}</h3>
    </div>
    <div className={`absolute inset-0 bg-gradient-to-r from-[#381e38] via-[#4f1579] to-[#2e0594]  opacity-30 transition-opacity duration-300 group-hover:opacity-40`} />
    <div className='absolute -bottom-4 -right-4 text-white opacity-30'>
      <Icon className='h-28 w-28' />
    </div>
  </div>
);
