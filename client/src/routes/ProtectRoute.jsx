import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layouts/MainLayout';
import { useUserStore } from '../store/user-store';
const ProtectedRoute = () => {


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

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoute;