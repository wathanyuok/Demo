import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import axios from '../../api/axios'
import { useSearchParams } from 'react-router-dom'

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5
  })

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const page = searchParams.get('page') || 1
      const search = searchParams.get('search') || ''
      
      const response = await axios.get('/api/backoffice/categories', {
        params: {
          page,
          search,
          limit: pagination.itemsPerPage
        }
      })

      const { categories: fetchedCategories, totalPages, totalItems } = response.data
      setCategories(fetchedCategories || [])
      setPagination(prev => ({
        ...prev,
        currentPage: Number(page),
        totalPages: totalPages || 1,
        totalItems: totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('ไม่สามารถโหลดข้อมูลได้')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios({
        method: editingId ? 'put' : 'post',
        url: editingId ? `/api/backoffice/categories/${editingId}` : '/api/backoffice/categories',
        data: { categoryName }
      })

      if (response.status === 200 || response.status === 201) {
        toast.success(editingId ? 'แก้ไขหมวดหมู่สำเร็จ' : 'เพิ่มหมวดหมู่สำเร็จ')
        setCategoryName('')
        setEditingId(null)
        setShowModal(false)
        fetchCategories()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาด')
    }
  }

  const handleEdit = (category) => {
    setCategoryName(category.categoryName)
    setEditingId(category.categoryID)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) return

    try {
      await axios.delete(`/api/backoffice/categories/${id}`)
      toast.success('ลบหมวดหมู่สำเร็จ')
      fetchCategories()
    } catch (err) {
      if (err.response?.data?.error === 'Category has products') {
        toast.error('ไม่สามารถลบได้ เนื่องจากมีสินค้าในหมวดหมู่นี้')
      } else {
        toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด')
      }
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    setSearchParams({ page: String(newPage) })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ page: '1', search: searchTerm })
  }

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="กรอกชื่อหมวดหมู่"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {editingId ? 'บันทึก' : 'เพิ่ม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">จัดการหมวดหมู่</h1>
        <div className="flex gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาหมวดหมู่..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              ค้นหา
            </button>
          </form>
          <button
            onClick={() => {
              setCategoryName('')
              setEditingId(null)
              setShowModal(true)
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            เพิ่มหมวดหมู่ใหม่
          </button>
        </div>
      </div>

      {showModal && <Modal />}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ลำดับ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ชื่อหมวดหมู่
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จำนวนสินค้า
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={category.categoryID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((pagination.currentPage - 1) * pagination.itemsPerPage) + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.categoryName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.productCount} รายการ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(category.categoryID)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  ไม่พบข้อมูลหมวดหมู่
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {categories.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            แสดง {categories.length} รายการ จากทั้งหมด {pagination.totalItems} รายการ
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
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg ${
                    pagination.currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {page}
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
      )}
    </div>
  )
}