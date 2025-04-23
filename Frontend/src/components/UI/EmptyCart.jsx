import { ShoppingCart } from "lucide-react";
import {NavLink} from 'react-router-dom'
const EmptyCart = () => (
	<div
		className='flex flex-col items-center justify-center space-y-4 py-16'
	>
		<ShoppingCart className='h-24 w-24 text-gray-300' />
		<h3 className='text-2xl font-semibold '>Your cart is empty</h3>
		<p className='text-gray-400'>Looks like you {"haven't"} added anything to your cart yet.</p>
		<NavLink
			className='mt-4 rounded-md bg-emerald-600 px-6 py-2 text-white font-medium transition-colors hover:bg-emerald-700'
			to='/'
		>
			Start Shopping
		</NavLink>
	</div>
);
export default EmptyCart