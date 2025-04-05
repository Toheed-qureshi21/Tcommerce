import  { useEffect } from 'react'

const Category = () => {
    useEffect(() => {
       window.scrollTo(0,0) 
    },[])
  return (
        <h1 className='w-full h-screen'>This is Category Page </h1>
  )
}

export default Category
