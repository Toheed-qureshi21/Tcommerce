import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyCoupon, getMyCoupon } from '../../API/api';
import { clearCoupon } from '../../redux/slices/cart.slice';

const GiftCouponCard = () => {
	const [userInputCoupon, setUserInputCoupon] = useState('');
	const {cartItems} = useSelector(state=>state.cart)
	const { coupon, isCouponApplied } = useSelector(state => state.cart);
	const dispatch = useDispatch();
	useEffect(() => {
		getMyCoupon(dispatch);
	}, []);
	useEffect(() => {
		if (coupon && cartItems.length>0) {
			setUserInputCoupon(coupon.code)
		}
	}, [coupon]);

	const handleApplyCoupon = () => {
		if (!userInputCoupon) {
			return;
		}
		applyCoupon(dispatch)
	}
	const handleRemoveCoupon = () => {
		dispatch(clearCoupon());
		setUserInputCoupon("");
	}

	return (
		<div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='space-y-4'>
				<div>
					<label htmlFor='voucher' className='mb-2 block text-sm font-medium text-gray-300'>
						Do you have a voucher or gift card?
					</label>
					<input
						type='text'
						id='voucher'
						className='block w-full rounded-lg border border-gray-600 bg-gray-700 
            p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
            focus:ring-emerald-500'
						placeholder='Enter code here'
						value={userInputCoupon}
						onChange={(e) => setUserInputCoupon(e.target.value)}
						required
					/>
				</div>
				<button
					type='button'
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					onClick={handleApplyCoupon}
				>Apply Coupon</button>
			</div>
			{isCouponApplied && coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Applied Coupon</h3>

					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>

					<button
						type='button'
						className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
             focus:ring-4 focus:ring-red-300'
						onClick={handleRemoveCoupon}
					>
						Remove Coupon
					</button>
				</div>
			)}
			{coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Your Available Coupon:</h3>
					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - {coupon.discount}% off
					</p>
				</div>
			)}
		</div>
	)
}

export default GiftCouponCard
