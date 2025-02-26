// import { create } from 'zustand'

// const useProductStore = create((set) => ({
//   cart: [],
//   products: [
//     {
//       id: 1,
//       name: 'Naruto เล่ม 1',
//       price: 65,
//       image: '/images/naruto-1.png',
//       category: 'แอคชั่น',
//       author: 'Masashi Kishimoto'

//     },
//     {
//       id: 2,
//       name: 'One Piece เล่ม 1',
//       price: 65,
//       image: '/images/one-piece-1.png',
//       category: 'แอคชั่น',
//       author: 'Eiichiro Oda'
//     },
//     {
//       id: 3,
//       name: 'Demon Slayer เล่ม 1',
//       price: 65,
//       image: '/images/demon-slayer.png',
//       category: 'แฟนตาซี',
//       author: 'Koyoharu Gotouge'
//     },
//     // เพิ่มการ์ตูนอื่นๆ ตามต้องการ
//   ],
//   addToCart: (product) =>
//     set((state) => ({
//       cart: [...state.cart, product],
//     })),
//   removeFromCart: (productId) =>
//     set((state) => ({
//       cart: state.cart.filter((item) => item.id !== productId),
//     })),
// }))

// export default useProductStore