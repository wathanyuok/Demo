// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import CategoryMenu from '../components/CategoryMenu';
// import { useUserStore } from '../store/user-store';
// import { useEffect } from 'react';
// import axios from 'axios';

const MainLayout = ({ children }) => {

  // const { user, setUser } = useUserStore((state) => ({
  //   user: state.user,
  //   setUser: state.setUser
  // }));
  // const token = localStorage.getItem('token');

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     if (token && !user) {
  //       try {
  //         const response = await axios.get(
  //           `${import.meta.env.VITE_URL_SERVER_API}/api/auth/me`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //         setUser(response.data);
  //       } catch (error) {
  //         console.error('Error fetching user:', error);
  //         localStorage.removeItem('token');
  //         setUser(null);
  //       }
  //     }
  //   };

  //   fetchUser();
  // }, [token, user, setUser]);


  // return (
  //   <div className="min-h-screen bg-base-100">
  //     <Header />
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="flex gap-8">
  //         {/* Category Menu */}
  //         <div className="hidden md:block sticky top-8">
  //           <CategoryMenu />
  //         </div>

  //         {/* Main Content */}
  //         <div className="flex-1">
  //           {children}
  //         </div>
  //       </div>

  //     </div>
  //     <Footer />
  //   </div>
  // );
};

export default MainLayout;