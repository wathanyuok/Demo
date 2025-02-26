import { useState } from 'react'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import useProductStore from '../store/product-store'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const cart = useProductStore((state) => state.cart)

  return (
    <header className="fixed top-0 w-full bg-primary-500 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-white">Anime Spirit</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-primary-100 hover:text-white transition-colors">หน้าแรก</a>
            <a href="#" className="text-primary-100 hover:text-white transition-colors">มังงะ</a>
            <a href="#" className="text-primary-100 hover:text-white transition-colors">หมวดหมู่</a>
            <a href="#" className="text-primary-100 hover:text-white transition-colors">โปรโมชั่น</a>
          </nav>

          {/* Search and Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหามังงะ..."
               
                className="w-64 px-4 py-2 rounded-full border-2 border-primary-300 focus:outline-none focus:border-primary-200 bg-white/10 text-white placeholder-primary-200"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-primary-200" />
            </div>
            <button className="relative p-2 text-white hover:text-primary-200 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-primary-100 hover:text-white hover:bg-primary-600 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-primary-600">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 rounded-md text-primary-100 hover:text-white hover:bg-primary-700">หน้าแรก</a>
              <a href="#" className="block px-3 py-2 rounded-md text-primary-100 hover:text-white hover:bg-primary-700">มังงะ</a>
              <a href="#" className="block px-3 py-2 rounded-md text-primary-100 hover:text-white hover:bg-primary-700">หมวดหมู่</a>
              <a href="#" className="block px-3 py-2 rounded-md text-primary-100 hover:text-white hover:bg-primary-700">โปรโมชั่น</a>
              <div className="mt-4 px-3">
                <input
                  type="text"
                  placeholder="ค้นหามังงะ..."
                  className="w-full px-4 py-2 rounded-full border-2 border-primary-300 focus:outline-none focus:border-primary-200 bg-white/10 text-white placeholder-primary-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}