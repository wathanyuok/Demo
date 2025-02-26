import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import AppRoutes from './routes/AppRoutes';


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      
      {/* Global Toast */}
      

            <ShoppingCart />

      

            </BrowserRouter>
  );
}

export default App;

