import { ArrowLeft, XCircle } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const PurchaseCancelPage = () => {
  return (
    <section className='min-h-screen flex items-center justify-center px-4'>
			<div
				className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'
			>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<XCircle className='text-red-500 w-16 h-16 mb-4' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-red-500 mb-2'>Purchase Cancelled</h1>
					<p className='text-gray-300 text-center mb-6'>
						Your order has been cancelled. No charges have been made.
					</p>
					<div className='bg-gray-700 rounded-lg p-4 mb-6'>
						<p className='text-sm text-gray-400 text-center'>
							If you encountered any issues during the checkout process, please don&apos;t hesitate to
							contact our support team.
						</p>
					</div>
					<div className='space-y-4'>
						<NavLink
							to={"/"}
							className='w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'
						>
							<ArrowLeft className='mr-2' size={18} />
							Return to Shop
						</NavLink>
					</div>
				</div>
			</div>
		</section>
  )
}

export default PurchaseCancelPage
