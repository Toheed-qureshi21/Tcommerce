import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addToCart, fetchCategoryWiseProducts } from '../../API/api';
import { useDispatch, useSelector } from "react-redux"

import ProductCard from '../UI/ProductCard';
import { Loader2 } from 'lucide-react';


const Category = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { products,loading } = useSelector((state) => state.products);
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo(0, 0)
    fetchCategoryWiseProducts(dispatch, category);
  }, []);
 
  if (loading) {

    return (
      <section className=''>
    <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin text-white">
      <Loader2 size={40} />
    </div>
  </div>
      </section>
  )
  }

  return (
    <section className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-center text-3xl font-bold mb-8">
          {category.charAt(0)?.toUpperCase() + category.slice(1)}
        </h2>
        <div className='flex flex-col  gap-6 justify-items-center'>
          {
            products?.length ===0 && (
              <>
              <h3 className='text-2xl font-semibold text-gray-300 text-center col-span-full'>
                No products found
              </h3>
                <button onClick={()=>navigate(-1)} className='bg-indigo-600 px-3 rounded-md py-2  hover:bg-indigo-700'>Go Back</button>
              </>
              
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
