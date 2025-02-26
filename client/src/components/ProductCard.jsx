import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
     
      <Link to={`/products/${product.productID}`} className="block relative h-48">
        <img
          src={product.productImage}
          alt={product.productName}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
       
            {/* <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`} /> */}
            <div className={`absolute inset-0 bg-gradient-to-t from-green-500/60 via-purple-500/40 to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`} />

        
      
        {product.discounts && product.discounts.length > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
            {product.discounts[0].discountType === 'percentage' 
              ? `-${product.discounts[0].discountValue}%`
              : `-฿${product.discounts[0].discountValue.toFixed(2)}`
            }
          </div>
        )}
      </Link>


      <div className="p-3">
        <Link to={`/products/${product.productID}`}>
          <h3 className="text-sm font-bold mb-1 line-clamp-2 hover:text-purple-600 transition-colors">
            {product.productName}
          </h3>
        </Link>

        <div className="space-y-1.5">
      
          <div className="flex items-baseline gap-1.5">
            {product.discounts && product.discounts.length > 0 ? (
              <>
                <span className="text-base font-bold text-purple-600">
                  ฿{(product.price - product.discounts[0].discountValue).toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ฿{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-purple-600">
                ฿{product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            {product.stockQuantity > 0 ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                มีสินค้า ({product.stockQuantity})
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                สินค้าหมด
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;