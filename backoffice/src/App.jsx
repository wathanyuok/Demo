// backoffice/src/App.jsx
import { BrowserRouter } from 'react-router-dom'
import { AdminRoutes } from './routes/adminRoute'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App