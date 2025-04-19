import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { addToCart, fetchCategoryWiseProducts } from '../../API/api';
import { useDispatch, useSelector } from "react-redux"

import ProductCard from '../UI/ProductCard';
import { asyncThunkCreator } from '@reduxjs/toolkit';

const Category = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchCategoryWiseProducts(dispatch, category);
  }, []);
 
  

  return (
    <section className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-center text-3xl font-bold mb-8">
          {category.charAt(0)?.toUpperCase() + category.slice(1)}
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'>
          {
            products?.length ===0 && (
              <h3 className='text-2xl font-semibold text-gray-300 text-center col-span-full'>
                No products found
              </h3>
            )
          }
          {
            products?.map((product) => {
              return (
                <ProductCard key={product._id} product={product} />
              )
            })
          }
        </div>
      </div>
    </section>
  )
}

export default Category
