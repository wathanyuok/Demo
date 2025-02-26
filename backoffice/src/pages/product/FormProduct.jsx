import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'

export default function AddProduct() {
  const navigate = useNavigate()
  const { id } = useParams() // ถ้ามี id แสดงว่าเป็นโหมดแก้ไข
  const { token } = useAuth()
  const [categories, setCategories] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryID: '',
    productImage: null,
    discounts: []
  })

  useEffect(() => {
    fetchCategories()
    fetchDiscounts()
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/backoffice/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const product = response.data
      
      setFormData({
        productName: product.productName,
        description: product.description,
        price: product.price.toString(),
        stockQuantity: product.stockQuantity.toString(),
        categoryID: product.categoryID,
        productImage: null,
        discounts: product.discounts.map(d => ({
          discountID: d.discountID,
          discountType: d.discountType,
          discountValue: d.discountValue,
          startDate: new Date(d.startDate).toISOString().split('T')[0],
          endDate: new Date(d.endDate).toISOString().split('T')[0]
        }))
      })

      if (product.productImage) {
        setPreview(product.productImage)
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      alert('ไม่สามารถดึงข้อมูลสินค้าได้')
      navigate('/products')
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/backoffice/categories', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCategories(response.data.categories || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get('/api/backoffice/discounts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('Discount response:', response.data)
      if (Array.isArray(response.data)) {
        setDiscounts(response.data)
      } else if (Array.isArray(response.data.discounts)) {
        setDiscounts(response.data.discounts)
      } else {
        console.error('Unexpected discount data format:', response.data)
        setDiscounts([])
      }
    } catch (err) {
      console.error('Error fetching discounts:', err)
      setDiscounts([])
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, productImage: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleDiscountChange = (e) => {
    const discountId = e.target.value
    if (!discountId) {
      setFormData(prev => ({ ...prev, discounts: [] }))
      return
    }

    const selectedDiscount = discounts.find(d => d.discountID === discountId)
    if (selectedDiscount) {
      const today = new Date()
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      setFormData(prev => ({
        ...prev,
        discounts: [{
          discountID: discountId,
          discountType: selectedDiscount.discountType,
          discountValue: selectedDiscount.discountValue,
          startDate: today.toISOString().split('T')[0],
          endDate: nextMonth.toISOString().split('T')[0]
        }]
      }))
    }
  }

  const handleDateChange = (type, value) => {
    if (formData.discounts.length > 0) {
      const updatedDiscount = { ...formData.discounts[0] }
      if (type === 'start') {
        updatedDiscount.startDate = value
      } else {
        updatedDiscount.endDate = value
      }
      setFormData(prev => ({ ...prev, discounts: [updatedDiscount] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = new FormData()
      form.append('productName', formData.productName)
      form.append('description', formData.description)
      form.append('price', formData.price)
      form.append('stockQuantity', formData.stockQuantity)
      form.append('categoryID', formData.categoryID)
      form.append('discounts', JSON.stringify(formData.discounts))
      if (formData.productImage) {
        form.append('file', formData.productImage)
      }

      if (id) {
       
        await axios.put(`/api/backoffice/products/${id}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        
        await axios.post('/api/backoffice/products', form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      navigate('/products')
    } catch (err) {
      console.error('Error saving product:', err)
      alert(id ? 'ไม่สามารถอัพเดทสินค้าได้' : 'ไม่สามารถสร้างสินค้าได้')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label className="block mb-2">รูปภาพสินค้า</label>
          <div className="flex items-center space-x-4">
            {preview && (
              <div className="w-32 h-32 relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null)
                    setFormData(prev => ({ ...prev, productImage: null }))
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">ชื่อสินค้า</label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">รายละเอียด</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full border p-2 rounded"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">ราคา</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className="w-full border p-2 rounded"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">จำนวนในคลัง</label>
          <input
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
            className="w-full border p-2 rounded"
            required
            min="0"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">หมวดหมู่</label>
          <select
            value={formData.categoryID}
            onChange={(e) => setFormData(prev => ({ ...prev, categoryID: e.target.value }))}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">ส่วนลด</label>
          <select
            value={formData.discounts[0]?.discountID || ''}
            onChange={handleDiscountChange}
            className="w-full border p-2 rounded mb-2"
          >
            <option value="">ไม่มีส่วนลด</option>
            {discounts.map((discount) => (
              <option key={discount.discountID} value={discount.discountID}>
                {discount.description} - {discount.discountType === 'percentage' 
                  ? `${discount.discountValue}%` 
                  : `${discount.discountValue} บาท`}
              </option>
            ))}
          </select>

          {formData.discounts.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm mb-1">วันที่เริ่มต้น</label>
                <input
                  type="date"
                  value={formData.discounts[0].startDate}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">วันที่สิ้นสุด</label>
                <input
                  type="date"
                  value={formData.discounts[0].endDate}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'กำลังบันทึก...' : (id ? 'อัพเดท' : 'สร้าง')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  )
}