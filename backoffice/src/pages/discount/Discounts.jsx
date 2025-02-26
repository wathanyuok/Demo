import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import axios from '../../api/axios'
import { useSearchParams } from 'react-router-dom'

export default function Discounts() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [description, setDescription] = useState('')
  const [discountType, setDiscountType] = useState('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [editId, setEditId] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5
  })
  const [searchTerm, setSearchTerm] = useState('')

  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      const page = searchParams.get('page') || 1
      const search = searchParams.get('search') || ''
      
      const response = await axios.get('/api/backoffice/discounts', {
        params: {
          page,
          search,
          limit: pagination.itemsPerPage
        }
      })

      const { discounts: fetchedDiscounts, totalPages, totalItems } = response.data
      setDiscounts(fetchedDiscounts || [])
      setPagination(prev => ({
        ...prev,
        currentPage: Number(page),
        totalPages: totalPages || 1,
        totalItems: totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching discounts:', error)
      toast.error('ไม่สามารถโหลดข้อมูลได้')
      setDiscounts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiscounts()
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios({
        method: editId ? 'put' : 'post',
        url: editId ? `/api/backoffice/discounts/${editId}` : '/api/backoffice/discounts',
        data: {
          description,
          discountType,
          discountValue: Number(discountValue)
        }
      })

      if (response.status === 200 || response.status === 201) {
        toast.success(editId ? 'แก้ไขส่วนลดสำเร็จ' : 'เพิ่มส่วนลดสำเร็จ')
        setDescription('')
        setDiscountType('percentage')
        setDiscountValue('')
        setEditId(null)
        setShowModal(false)
        fetchDiscounts()
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      if (error.response?.data?.error === 'Discount name already exists') {
        toast.error('ชื่อส่วนลดนี้มีอยู่แล้ว กรุณาใช้ชื่ออื่น')
      } else {
        toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      }
    }
  }

  const handleEdit = (discount) => {
    setDescription(discount.description)
    setDiscountType(discount.discountType)
    setDiscountValue(discount.discountValue.toString())
    setEditId(discount.discountID)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('คุณต้องการลบส่วนลดนี้ใช่หรือไม่?')) return

    try {
      await axios.delete(`/api/backoffice/discounts/${id}`)
      toast.success('ลบส่วนลดสำเร็จ')
      fetchDiscounts()
    } catch (err) {
      if (err.response?.data?.error === 'ไม่สามารถลบส่วนลดที่ถูกใช้งานกับสินค้าแล้ว') {
        toast.error('ไม่สามารถลบได้ เนื่องจากส่วนลดนี้ถูกใช้งานกับสินค้าแล้ว')
      } else {
        toast.error(err.response?.data?.error || 'เกิดข้อผิดพลาด')
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
        <h1 className="text-2xl font-bold">จัดการส่วนลด</h1>
        <div className="flex gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาส่วนลด..."
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
              setDescription('')
              setDiscountType('percentage')
              setDiscountValue('')
              setEditId(null)
              setShowModal(true)
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            เพิ่มส่วนลดใหม่
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">
              {editId ? 'แก้ไขส่วนลด' : 'เพิ่มส่วนลด'}
            </h2>
            <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
              <div className="mb-4">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="รายละเอียดส่วนลด"
                  required
                />
              </div>

              <div className="mb-4">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="percentage">เปอร์เซ็นต์</option>
                  <option value="fixed">จำนวนเงิน</option>
                </select>
              </div>

              <div className="mb-4">
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={discountType === 'percentage' ? 'กรอกเปอร์เซ็นต์ส่วนลด' : 'กรอกจำนวนเงินส่วนลด'}
                  min="0"
                  max={discountType === 'percentage' ? "100" : undefined}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  {editId ? 'อัพเดท' : 'เพิ่ม'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ลำดับ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                รายละเอียดส่วนลด
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ประเภท
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                มูลค่า
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {discounts.length > 0 ? (
              discounts.map((discount, index) => (
                <tr key={discount.discountID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((pagination.currentPage - 1) * pagination.itemsPerPage) + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {discount.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.discountType === 'percentage' ? 'เปอร์เซ็นต์' : 'จำนวนเงิน'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.discountValue}{discount.discountType === 'percentage' ? '%' : ' บาท'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(discount)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(discount.discountID)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  ไม่พบข้อมูลส่วนลด
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {discounts.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            แสดง {discounts.length} รายการ จากทั้งหมด {pagination.totalItems} รายการ
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
