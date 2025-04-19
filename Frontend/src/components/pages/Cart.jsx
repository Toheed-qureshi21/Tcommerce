import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import EmptyCart from '../UI/EmptyCart';
import CartItem from '../UI/CartItem';
import { fetchCartItems } from '../../API/api';
import PeopleAlsoBought from '../UI/PeopleAlsoBought';
import OrderSummary from '../UI/OrderSummary';
import GiftCouponCard from '../UI/GiftCouponCard';
const Cart = () => {
  const { cartItems } = useSelector(state => state.cart); 
  const dispatch = useDispatch();
  useEffect(()=>{
    fetchCartItems(dispatch);
  },[dispatch])
  return (
    <div className='py-8 md:py-16 min-h-screen'>
      <div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
        <div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
          <div className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'>
          {cartItems.length === 0 ? (
              <EmptyCart/>
          ):(
            <div className='space-y-6'>
								{cartItems.map((item) => (
									<CartItem key={item._id} item={item} />
								))}
                  </div>
                )}
                {
                  cartItems.length > 0 && <PeopleAlsoBought/>
                }
              </div>
              <div
							className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'>
                <OrderSummary/>
                <GiftCouponCard/>
              </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
