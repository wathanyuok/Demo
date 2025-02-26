// import ProductCard from '../components/ProductCard'
// import useProductStore from '../store/product-store'

// export default function Home() {
//   const products = useProductStore((state) => state.products)

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">มังงะยอดนิยม</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   )
// }