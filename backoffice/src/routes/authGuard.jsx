// // backoffice/src/routes/authGuard.jsx
// import { Navigate } from 'react-router-dom'

// export const AuthGuard = ({ children }) => {
//   // TODO: เพิ่มการตรวจสอบ token หรือสถานะการล็อกอิน
//   const isAuthenticated = localStorage.getItem('token')
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />
//   }

//   return children
// }