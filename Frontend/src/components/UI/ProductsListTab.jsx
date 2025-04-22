import { useEffect } from "react"
import "../../index.css"
import { deleteProduct, fetchAllProductsOfAdmin, toggleFeaturedProduct } from "../../API/api.js"
import { useDispatch, useSelector } from 'react-redux';
import { Star, Trash } from "lucide-react";
import { setLoadingFeature } from "../../redux/slices/product.slice.js";
const ProductsListTab = () => {

	const dispatch = useDispatch();
	const { products,loadingDelete,loadingFeature } = useSelector(state => state.products)
	useEffect(() => {
		fetchAllProductsOfAdmin(dispatch);
	}, []);

	const handleDeleteProduct = async(productId) => {
			await deleteProduct(dispatch,productId);
	}
	

	return (
		<section className='shadow-lg rounded-lg overflow-x-scroll custom-scrollbar max-w-4xl mx-auto'>

			<table className=' min-w-full divide-y divide-gray-700 table-auto mx-auto w-[50%] text-left border-collapse'>
				<thead className='bg-gray-700'>
					<tr>
						<th
							scope='col'
							className='common-th'
						>
							Product
						</th>
						<th
							scope='col'
							className='common-th'
						>
							Price
						</th>
						<th
							scope='col'
							className='common-th'
						>
							Category
						</th>

						<th
							scope='col'
							className='common-th'
						>
							Featured
						</th>
						<th
							scope='col'
							className='common-th'
						>
							Actions
						</th>
					</tr>
				</thead>

				<tbody className='bg-gray-800 divide-y divide-gray-700'>
					{
						products?.map((product) => {
							return (
								<tr key={product._id} className='hover:bg-gray-700'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='flex items-center'>
											<div className='flex-shrink-0 h-10 w-10'>
												<img
													className='h-10 w-10 rounded-full object-cover'
													src={product.image}
													alt={product.name}
												/>
											</div>
											<div className='ml-4'>
												<div className='text-sm font-medium text-white'>{product.name}</div>
											</div>
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-300'>${product.price.toFixed(2)}</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-300'>{product.category}</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
											<button
												 onClick={() => {
													toggleFeaturedProduct(dispatch, product?._id);
												  }}
												className={`p-1 rounded-full ${product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-gray-100"
													} hover:bg-yellow-600 transition-colors duration-200`}
													disabled={loadingFeature}
											>
												<Star className='h-5 w-5' />
											</button>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
										<button
											onClick={() => handleDeleteProduct(product._id)}
											className='text-red-400 hover:text-red-300'
											disabled={loadingDelete}
										>
											<Trash className='h-5 w-5' />
										</button>
									</td>
								</tr>
							)
						})
					}
				</tbody>
			</table>
		</section>
	)
}

export default ProductsListTab
