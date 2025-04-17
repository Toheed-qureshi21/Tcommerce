import { Loader, PlusCircle, Upload } from 'lucide-react';
import "../../index.css"
import React, { useState } from 'react'
import { createProduct } from '../../API/api';
import { useDispatch, useSelector } from 'react-redux';

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];
const CreateProductTab = () => {

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.products);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      }
      reader.readAsDataURL(file);

    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(dispatch, newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch (error) {
      console.log("GETTING ERROR IN CREATE PRODUCT", error);
    }
  }



  return (
    <section className='bg-gradient-to-r from-[#1a0b1f] via-[#2b1a38] to-[#0e0a18]  shadow-lg rounded-lg p-8  max-w-xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-4 text-white text-center'>Create New Product</h2>
      <form onSubmit={handleFormSubmit} className="space-y-6 text-white">
        <div>
          <label htmlFor="name" className='block text-sm font-medium'>
            Product Name
          </label>
          <input
            type="text"
            id='name'
            name="name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className='common-input'
            autoComplete='off'
            required
            placeholder='Product Name'
          />
        </div>
        <div>
          <label htmlFor="name" className='block text-sm font-medium'>
            Description
          </label>
          <textarea
            id='description'
            name='description'
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            rows='3'
            className='common-input'
            required
            placeholder='Product Description'
          />
        </div>
        <div>
          <label htmlFor="name" className='block text-sm font-medium'>
            Price
          </label>
          <input
            type='number'
            id='price'
            name='price'
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            step='0.01'
            className='common-input'
            required
            placeholder='Product Price'
          />
        </div>
        <div>
          <label htmlFor="name" className='block text-sm font-medium'>
            Category
          </label>
          <select
            id='category'
            name='category'
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className='common-input'
            required
          >
            <option value='' className='text-black'>Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category} className='p-4 text-black'>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 flex items-center'>
       
          <input type='file'  id='image' name='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
          <label
            htmlFor='image'
            className='cursor-pointer bg-fuchsia-900 py-2 px-3 border border-fuchsia-900 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-fuchsia-950 '
          >
            <Upload className='h-5 w-5 inline-block mr-2 ' />
            Upload Image
          </label>
        
          {newProduct.image && (
            <div className="mt-2 block">
              <img
                src={newProduct.image}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-md border ml-4 "
              />
            </div>
          )}

        </div>
        <button
          type='submit'
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					disabled:opacity-50'
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className='mr-2 h-5 w-5' />
              Create Product
            </>
          )}
        </button>
      </form>
    </section>
  )
}

export default CreateProductTab
