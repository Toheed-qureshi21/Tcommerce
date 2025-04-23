import { ArrowRight, CheckCircle, HandHeart} from 'lucide-react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'
import { handleCheckoutSuccess } from '../../API/api';
import PaymentProcessing from '../UI/PaymentProcessing';
import Confetti from 'react-confetti-boom';

const PurchaseSuccessPage = () => {
	const dispatch = useDispatch();
	const {isPurchaseProcessing} = useSelector(state=>state.cart);
	useEffect(()=>{
		const sessionId = new URLSearchParams(window.location.search).get("session_id");
		if (sessionId && !isPurchaseProcessing) {  // Only make request if not processing
			handleCheckoutSuccess(dispatch, sessionId);
		}
	},[dispatch]);

	if (isPurchaseProcessing) {
		return (
			<PaymentProcessing/>
		)
	}

	return (
		<section className='h-screen flex items-center justify-center px-4'>
			<Confetti
			  particleCount={150}
			  width={window.innerWidth}
			  height={window.innerHeight}
			/>
			<div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<CheckCircle className='text-emerald-400 w-16 h-16 mb-4' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
						Purchase Successful!
					</h1>

					<p className='text-gray-300 text-center mb-2'>
						Thank you for your order. {"We're"} processing it now.
					</p>
					<p className='text-emerald-400 text-center text-sm mb-6'>
						Check your email for order details and updates.
					</p>
					<div className='bg-gray-700 rounded-lg p-4 mb-6'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm text-gray-400'>Order number</span>
							<span className='text-sm font-semibold text-emerald-400'>#12345</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-400'>Estimated delivery</span>
							<span className='text-sm font-semibold text-emerald-400'>3-5 days</span>
						</div>
					</div>

					<div className='space-y-4'>
						<button
							className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center'
						>
							<HandHeart className='mr-2' size={18} />
							Thanks for trusting us!
						</button>
						<NavLink
							to={"/"}
							className='w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 
            rounded-lg transition duration-300 flex items-center justify-center '
						>
							Continue Shopping
							<ArrowRight className='ml-2' size={18} />
						</NavLink>
					</div>
				</div>
			</div>
		</section>
	)
}

export default PurchaseSuccessPage
