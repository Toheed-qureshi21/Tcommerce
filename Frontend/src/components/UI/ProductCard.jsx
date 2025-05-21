import { Loader2, ShoppingCart } from 'lucide-react'
import React from 'react'
import { addToCart } from '../../API/api';
import { useDispatch, useSelector } from 'react-redux';

const ProductCard = ({product}) => {
    const dispatch = useDispatch();
    const {loading} = useSelector(state=>state.cart);
    const handleAddToCart = async(productId) => {
        await addToCart(dispatch, productId);
      }
  return (
    <div className='flex w-fit relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
    <div className='relative mx-3 mt-4 flex h-60 overflow-hidden rounded-xl'>
        <img className='object-cover ' src={product.image} alt='product image' />
        <div className='absolute inset-0  bg-opacity-20' />
    </div>

    <div className='mt-4 px-5 pb-5'>
        <h5 className='text-xl font-semibold tracking-tight text-white'>{product.name.charAt(0)?.toUpperCase() + product.name.slice(1)}</h5>
        <div className='mt-2 mb-5 flex items-center justify-between'>
            <p>
                <span className='text-3xl font-bold text-emerald-400'>${product.price}</span>
            </p>
        </div>
        <button
            className={`flex items-center justify-center rounded-lg  px-5 py-2.5 text-center text-sm font-medium
             text-white  focus:outline-none  ${loading?"cursor-not-allowed  bg-gray-600":"cursor-pointer bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300"}`}
            onClick={()=>handleAddToCart(product._id)}
            disabled={loading}
        >
            {
                loading ? (
                    <span className='flex gap-4 '>
                        Processing
                        <Loader2 size={22} className='mr-2 animate-spin'/>
                    </span>
                ):(
                    <span className='flex gap-2'>

                    <ShoppingCart size={22} className='mr-2' />
                    Add to cart
                    </span>
                )
            }
        </button>
    </div>
</div>
  )
}

export default ProductCard
