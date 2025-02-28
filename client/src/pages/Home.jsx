import { useEffect } from 'react';
import create from 'zustand';

// Mock Data สำหรับมังงะ
const mockProducts = [
  {
    productID: 1,
    title: "Naruto",
    description: "มังงะเกี่ยวกับนินจาที่ได้รับความนิยมสูงสุด",
    price: 300,
    imageUrl: "https://i.imgur.com/9tCfuNo.jpeg",
  },
  {
    productID: 2,
    title: "One Piece",
    description: "เรื่องราวการผจญภัยของโจรสลัด",
    price: 350,
    imageUrl: "https://imgur.com/1GxZkAW.jpg",
  },
  {
    productID: 3,
    title: "Attack on Titan",
    description: "มังงะแนวดาร์คแฟนตาซี",
    price: 400,
    imageUrl: "https://i.imgur.com/tc5RqMl.jpeg",
  },
  {
    productID: 3,
    title: "Dragon Ball",
    description: "มังงะแนวผจญภัยและต่อสู้",
    price: 400,
    imageUrl: "https://i.imgur.com/XSPR5FL.jpeg",
  },

  {
    productID: 1,
    title: "Naruto",
    description: "มังงะเกี่ยวกับนินจาที่ได้รับความนิยมสูงสุด",
    price: 300,
    imageUrl: "https://i.imgur.com/9tCfuNo.jpeg",
  },
  {
    productID: 2,
    title: "One Piece",
    description: "เรื่องราวการผจญภัยของโจรสลัด",
    price: 350,
    imageUrl: "https://imgur.com/1GxZkAW.jpg",
  },
  {
    productID: 3,
    title: "Attack on Titan",
    description: "มังงะแนวดาร์คแฟนตาซี",
    price: 400,
    imageUrl: "https://i.imgur.com/tc5RqMl.jpeg",
  },
  {
    productID: 3,
    title: "Dragon Ball",
    description: "มังงะแนวผจญภัยและต่อสู้",
    price: 400,
    imageUrl: "https://i.imgur.com/XSPR5FL.jpeg",
  },
];

// สร้าง Zustand Store สำหรับจัดการ State
const useProductStore = create((set) => ({
  products: [],
  fetchProducts: () => {
    // จำลองการเรียก API
    set({ products: mockProducts });
  },

  
}));

// Component สำหรับแสดงสินค้าแต่ละรายการ
function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-lg font-semibold">{product.title}</h2>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="text-lg font-bold mt-2">฿{product.price}</p>
    </div>
  );
}

// หน้า Home หลัก
export default function Home() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">มังงะยอดนิยม</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.productID} product={product} />
        ))}
      </div>
    </div>
  );
}


