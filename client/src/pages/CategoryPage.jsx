import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const [categoryRes, productsRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_URL_SERVER_API}/api/categories/${id}`),
            axios.get(`${import.meta.env.VITE_URL_SERVER_API}/api/products?categoryId=${id}`)
          ]);
        setCategory(categoryRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-96 bg-base-200 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-error">ไม่พบหมวดหมู่ที่ค้นหา</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.categoryName}</h1>
        {category.description && (
          <p className="text-base-content/70">{category.description}</p>
        )}
        <div className="text-sm text-base-content/50 mt-2">
          พบสินค้าทั้งหมด {products.length} รายการ
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.productID} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <h3 className="text-xl font-semibold">ไม่พบสินค้าในหมวดหมู่นี้</h3>
          <p className="text-base-content/70 mt-2">
            กรุณาเลือกดูสินค้าในหมวดหมู่อื่น
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;