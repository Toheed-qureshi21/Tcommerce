import { ShoppingCart, Package, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import "../../index.css"
const LoadingScreen = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoaded(true);    // Mark as loaded to show the next content
      }, 4000); // 4 seconds
  
      return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <div className="flex items-center space-x-4 mb-6">
        <ShoppingCart className="w-12 h-12 text-emerald-400 animate-bounce" />
        <h1 className="text-5xl sm:text-6xl font-bold text-emerald-400 font-jaini">TCOMMERCE</h1>
        <Package className="w-12 h-12 text-emerald-400 animate-bounce" />
      </div>
      <div className="space-y-4">
        <p className="text-xl text-gray-300">Your one-stop online shop.</p>
        <p className="text-sm text-gray-400 text-center">Loading, please wait...</p>
      </div>
      {!isLoaded ? (
        <div className="flex flex-col items-center mt-8 relative">
          <div className="truck-animation absolute top-[2rem]">
            <Truck className="w-16 h-16 text-emerald-400" />
          </div>
          <p className="text-lg text-gray-400">Preparing everything for you...</p>
        </div>
      ) : (
        <p className="text-lg text-emerald-400 mt-4">Welcome to TCOMMERCE!</p>
      )}
    </div>
  );
};

export default LoadingScreen;
