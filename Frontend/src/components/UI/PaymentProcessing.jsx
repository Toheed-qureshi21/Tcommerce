import { Loader } from 'lucide-react';

const PaymentProcessing = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4 ">
      <Loader className="animate-spin text-white w-16 h-16" />
      <h1 className="text-xl sm:text-3xl font-bold text-emerald-400 ">Processing Payment...</h1>
      <p className="text-sm sm:text-lg text-gray-300 ">Please wait while we complete your transaction.</p>
    </div>
  );
};

export default PaymentProcessing;
