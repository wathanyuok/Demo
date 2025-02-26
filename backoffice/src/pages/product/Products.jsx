// src/pages/Products.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'

export default function Products() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [pagination, setPagination] = useState({
    currentPage: Number(searchParams.get('page')) || 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const { token } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }, [navigate])

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      const page = searchParams.get('page') || 1
      const search = searchParams.get('search') || ''
      
      const response = await axios.get('/api/backoffice/products', {
        params: {
          page,
          search,
          limit: pagination.itemsPerPage
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProducts(response.data.products)
      setPagination({
        ...pagination,
        currentPage: Number(page),
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems
      })
      setError(null)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
        return
      }
      setError('ไม่สามารถโหลดข้อมูลสินค้าได้')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ 
      page: 1,
      search: searchTerm
    })
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    
    setSearchParams({ 
      page: newPage,
      ...(searchTerm && { search: searchTerm })
    })
  }

  const handleDelete = async (productID) => {
    if (!window.confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) return

    try {
      await axios.delete(`/api/backoffice/products/${productID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      fetchProducts()
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
        return
      }
      alert('ไม่สามารถลบสินค้าได้')
      console.error('Error deleting product:', err)
    }
  }

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price
    if (!discount.startDate || !discount.endDate) return price

    const now = new Date()
    const startDate = new Date(discount.startDate)
    const endDate = new Date(discount.endDate)

    if (now < startDate || now > endDate) return price

    return discount.discountType === 'percentage'
      ? price - (price * discount.discountValue / 100)
      : price - discount.discountValue
  }

  const isDiscountActive = (discount) => {
    if (!discount || !discount.startDate || !discount.endDate) return false

    const now = new Date()
    const startDate = new Date(discount.startDate)
    const endDate = new Date(discount.endDate)

    return now >= startDate && now <= endDate
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">จัดการสินค้า</h1>
        <Link
          to="/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          เพิ่มสินค้า
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาสินค้า..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ค้นหา
          </button>
        </div>
      </form>

      {error ? (
        <div className="text-center text-red-600 p-4">
          <p>{error}</p>
          <button 
            onClick={fetchProducts}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ลองใหม่
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รูปภาพ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อสินค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ราคา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จำนวน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ส่วนลด
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const activeDiscount = product.discounts?.find(isDiscountActive)
                  return (
                    <tr key={product.productID}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={product.productImage || '/placeholder.png'} 
                          alt={product.productName}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.category?.categoryName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${activeDiscount ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          ฿{product.price.toLocaleString()}
                        </div>
                        {activeDiscount && (
                          <div className="text-sm text-green-600 font-medium">
                            ฿{calculateDiscountedPrice(product.price, activeDiscount).toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${
                          product.stockQuantity < 10 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {product.stockQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {activeDiscount ? (
                          <div>
                            <div className="text-sm text-green-600 font-medium">
                              {activeDiscount.discountType === 'percentage'
                                ? `${activeDiscount.discountValue}%`
                                : `฿${activeDiscount.discountValue}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              ถึง {new Date(activeDiscount.endDate).toLocaleDateString('th-TH')}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">-</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <Link
                          to={`/products/edit/${product.productID}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          แก้ไข
                        </Link>
                        <button
                          onClick={() => handleDelete(product.productID)}
                          className="text-red-600 hover:text-red-900"
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

 
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              แสดง {products.length} รายการ จากทั้งหมด {pagination.totalItems} รายการ
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                ก่อนหน้า
              </button>
              <div className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      pagination.currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                ถัดไป
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}