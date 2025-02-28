// src/backoffice/layouts/AdminLayout.jsx
import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  Package,
  Tags,
  Settings,
  ChevronDown,
  Menu,
  X,
  Percent,
  TicketPercent,
  ListOrdered,
  LogOut
} from 'lucide-react'

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const menuItems = [
    { icon: Tags, name: 'หมวดหมู่สินค้า', path: '/categories' },
    { icon: Package, name: 'จัดการสินค้า', path: '/products' },
    { icon: TicketPercent, name: 'จัดการส่วนลด', path: '/discounts' },
    { icon: ListOrdered, name: 'จัดการออเดอร์', path: '/orders' },


  ]

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 w-64 h-screen transition-transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center justify-between mb-6 px-3">
            <span className="text-xl font-bold text-[#FF69B4] bg-gradient-to-r from-[#FFB6C1] via-[#FFD700] to-[#87CEEB] bg-clip-text text-transparent">
              Manga Admin
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center p-3 text-[#66b4de] rounded-lg hover:bg-gradient-to-r hover:from-[#FFB6C1] hover:via-[#FFD700] hover:to-[#87CEEB]"                  >
                  <item.icon className="w-5 h-5" />
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          
          <div className="mt-auto border-t p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`
        p-4 md:ml-64
        ${isSidebarOpen ? 'md:ml-64' : ''}
      `}>
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-left space-x-100">
            <div className="relative">
              <button className="flex items-center space-x-1 text-sm">
                <img
                  src="https://ui-avatars.com/api/?background=00C1D0&color=fff&name=Admin"
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
                <span>Admin</span>

              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="bg-white rounded-lg shadow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}