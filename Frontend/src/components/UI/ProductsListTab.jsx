import { useEffect } from "react";
import "../../index.css";
import { deleteProduct, fetchAllProductsOfAdmin, toggleFeaturedProduct } from "../../API/api.js";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Star, Trash } from "lucide-react";

const ProductsListTab = () => {
  const dispatch = useDispatch();
  const { loading, products, loadingDelete, loadingFeature } = useSelector(state => state.products);

  useEffect(() => {
    fetchAllProductsOfAdmin(dispatch);
  }, []);

  const handleDeleteProduct = async (productId) => {
    await deleteProduct(dispatch, productId);
  };

  return (
    <section className="shadow-lg h-screen rounded-lg p-4 ">
      {loading ? (
      <div className="flex justify-center ">
      <div className="animate-spin text-white">
        <Loader2 size={40} />
      </div>
    </div>
    
      ) : (
      
        <div className="overflow-x-auto custom-scrollbar rounded-lg">
          <table className="min-w-[700px] w-full table-auto text-left border-collapse">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="common-th px-4 py-3">Product</th>
                <th className="common-th px-4 py-3">Price</th>
                <th className="common-th px-4 py-3">Category</th>
                <th className="common-th px-4 py-3">Featured</th>
                <th className="common-th px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {products?.map((product) => (
                <tr key={product._id} className="hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-white">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-300">${product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-300">{product.category}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => toggleFeaturedProduct(dispatch, product?._id)}
                      className={`p-1 rounded-full ${
                        product.isFeatured
                          ? "bg-yellow-400 text-gray-900"
                          : "bg-gray-800 text-gray-100"
                      } hover:bg-yellow-600 transition-colors duration-200`}
                      disabled={loadingFeature}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-400 hover:text-red-300"
                      disabled={loadingDelete}
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ProductsListTab;
