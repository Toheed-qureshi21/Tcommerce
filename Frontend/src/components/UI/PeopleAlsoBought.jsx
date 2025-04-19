import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRecommendedProducts } from '../../API/api';
import ProductCard from './ProductCard';


const PeopleAlsoBought = () => {
   const dispatch = useDispatch();
   const { recommendedProducts} = useSelector((state) => state.cart);

   useEffect(()=>{
    fetchRecommendedProducts(dispatch);
   },[dispatch])

  return (
    <div className='mt-8'>
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
				{ recommendedProducts.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
  )
}

export default PeopleAlsoBought
