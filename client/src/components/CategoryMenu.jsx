import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Sword, Heart, Star, Zap, Flame, Ghost, Coffee } from 'lucide-react';

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);


  const categoryIcons = {
   
    'ทั้งหมด': <Star className="w-5 h-5" />
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL_SERVER_API}/api/categories`
        );
        setCategories([{ categoryName: 'ทั้งหมด', categoryID: 'all' }, ...response.data]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-base-100 rounded-lg shadow-lg p-4 w-64">
<h2 
  className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 drop-shadow-md"
>        หมวดหมู่มังงะ
      </h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.categoryID}>
            <Link
              to={category.categoryID === 'all' ? '/products' : `/category/${category.categoryID}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-100 transition-colors"
            >
              {categoryIcons[category.categoryName] || <Star className="w-5 h-5" />}
              <span>{category.categoryName}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryMenu;