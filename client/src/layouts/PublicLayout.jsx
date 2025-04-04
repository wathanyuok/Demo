import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryMenu from '../components/CategoryMenu';
import { useEffect } from 'react';
import { useUserStore } from '../store/user-store';
import axios from 'axios';

const PublicLayout = ({ children }) => {
    const { user, setUser } = useUserStore((state) => ({
        user: state.user,      
        setUser: state.setUser  
    }));

    const token = localStorage.getItem('token');

    

    useEffect(() => {
        const fetchUser = async () => {
            if (token && !user) {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_URL_SERVER_API}/api/auth/me`, 
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, 
                            },
                        }
                    );
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user:', error); 

                    localStorage.removeItem('token');

                    setUser(null);
                }
            }
        };

        fetchUser();
    }, [token, user, setUser]); 

    return (
        <div className="min-h-screen bg-base-100">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    <div className="hidden md:block sticky top-8">
                        <CategoryMenu />
                    </div>

                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* ส่วนท้ายของหน้า */}
            <Footer />
        </div>
    );
};

export default PublicLayout;
