// นำเข้าฟังก์ชันและ hooks ที่จำเป็นจาก React และ React Router
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// นำเข้า axios instance ที่กำหนดค่าไว้แล้ว
import axios from '../../api/axios'
// นำเข้า hook สำหรับการจัดการ authentication
import { useAuth } from '../../contexts/AuthContext'

// ประกาศ component AddProduct
export default function AddProduct() {
  // สร้าง function สำหรับการนำทางไปยังหน้าอื่น
  const navigate = useNavigate()
  // ดึง id จาก URL parameters (ถ้ามี id แสดงว่าเป็นโหมดแก้ไข)
  const { id } = useParams()
  // ดึง token จาก AuthContext
  const { token } = useAuth()

  // สร้าง state สำหรับเก็บข้อมูลหมวดหมู่
  const [categories, setCategories] = useState([])
  // สร้าง state สำหรับเก็บข้อมูลส่วนลด
  const [discounts, setDiscounts] = useState([])
  // สร้าง state สำหรับแสดงสถานะ loading
  const [loading, setLoading] = useState(false)
  // สร้าง state สำหรับเก็บ URL ของรูปภาพ preview
  const [preview, setPreview] = useState(null)
  // สร้าง state สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryID: '',
    productImage: null,
    discounts: []
  })

  // ใช้ useEffect เพื่อเรียกใช้ฟังก์ชันเมื่อ component ถูกโหลด
  useEffect(() => {
    fetchCategories()
    fetchDiscounts()
    if (id) {
      fetchProduct()
    }
  }, [id])

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้า (กรณีแก้ไข)
  const fetchProduct = async () => {
    try {
      // ส่ง request เพื่อดึงข้อมูลสินค้าตาม id
      const response = await axios.get(`/api/backoffice/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const product = response.data

      // กำหนดค่า formData จากข้อมูลสินค้าที่ได้รับ
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

      // ถ้ามีรูปภาพ ให้แสดง preview
      if (product.productImage) {
        setPreview(product.productImage)
      }
    } catch (err) {
      // แสดงข้อผิดพลาดถ้าไม่สามารถดึงข้อมูลได้
      console.error('Error fetching product:', err)
      alert('ไม่สามารถดึงข้อมูลสินค้าได้')
      navigate('/products')
    }
  }

  // ฟังก์ชันสำหรับดึงข้อมูลหมวดหมู่
  const fetchCategories = async () => {
    try {
      // ส่ง request เพื่อดึงข้อมูลหมวดหมู่
      const response = await axios.get('/api/backoffice/categories', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCategories(response.data.categories || [])
    } catch (err) {
      // แสดงข้อผิดพลาดถ้าไม่สามารถดึงข้อมูลได้
      console.error('Error fetching categories:', err)
    }
  }

  // ฟังก์ชันสำหรับดึงข้อมูลส่วนลด
  const fetchDiscounts = async () => {
    try {
      // ส่ง request เพื่อดึงข้อมูลส่วนลด
      const response = await axios.get('/api/backoffice/discounts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('Discount response:', response.data)
      // ตรวจสอบรูปแบบข้อมูลที่ได้รับและกำหนดค่า state
      if (Array.isArray(response.data)) {
        setDiscounts(response.data)
      } else if (Array.isArray(response.data.discounts)) {
        setDiscounts(response.data.discounts)
      } else {
        console.error('Unexpected discount data format:', response.data)
        setDiscounts([])
      }
    } catch (err) {
      // แสดงข้อผิดพลาดถ้าไม่สามารถดึงข้อมูลได้
      console.error('Error fetching discounts:', err)
      setDiscounts([])
    }
  }


  // ฟังก์ชันจัดการการเปลี่ยนแปลงรูปภาพ
  const handleImageChange = (e) => {
    // ดึงไฟล์แรกจาก input
    const file = e.target.files[0]
    if (file) {
      // อัปเดต state formData โดยเพิ่มไฟล์รูปภาพ
      setFormData(prev => ({ ...prev, productImage: file }))
      // สร้าง URL สำหรับ preview รูปภาพ
      setPreview(URL.createObjectURL(file))
    }
  }

  // ฟังก์ชันจัดการการเปลี่ยนแปลงส่วนลด
  const handleDiscountChange = (e) => {
    // ดึงค่า ID ของส่วนลดที่เลือก
    const discountId = e.target.value
    if (!discountId) {
      // ถ้าไม่มีส่วนลดที่เลือก ให้ล้างข้อมูลส่วนลด
      setFormData(prev => ({ ...prev, discounts: [] }))
      return
    }

    // ค้นหาข้อมูลส่วนลดจาก ID ที่เลือก
    const selectedDiscount = discounts.find(d => d.discountID === discountId)
    if (selectedDiscount) {
      // สร้างวันที่ปัจจุบันและวันที่หนึ่งเดือนถัดไป
      const today = new Date()
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      // อัปเดต state formData ด้วยข้อมูลส่วนลดที่เลือก
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

  // ฟังก์ชันจัดการการเปลี่ยนแปลงวันที่ของส่วนลด
  const handleDateChange = (type, value) => {
    if (formData.discounts.length > 0) {
      // สร้าง object ใหม่จากข้อมูลส่วนลดเดิม
      const updatedDiscount = { ...formData.discounts[0] }
      if (type === 'start') {
        // อัปเดตวันที่เริ่มต้น
        updatedDiscount.startDate = value
      } else {
        // อัปเดตวันที่สิ้นสุด
        updatedDiscount.endDate = value
      }
      // อัปเดต state formData ด้วยข้อมูลส่วนลดที่แก้ไขแล้ว
      setFormData(prev => ({ ...prev, discounts: [updatedDiscount] }))
    }
  }

  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = async (e) => {
    // ป้องกันการ reload หน้า
    e.preventDefault()
    // เริ่มแสดงสถานะ loading
    setLoading(true)

    try {
      // สร้าง FormData object สำหรับส่งข้อมูล
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
        // ถ้ามี id แสดงว่าเป็นการอัปเดตสินค้า
        await axios.put(`/api/backoffice/products/${id}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // ถ้าไม่มี id แสดงว่าเป็นการสร้างสินค้าใหม่
        await axios.post('/api/backoffice/products', form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      // นำทางไปยังหน้ารายการสินค้า
      navigate('/products')
    } catch (err) {
      // แสดงข้อผิดพลาดถ้าไม่สามารถบันทึกข้อมูลได้
      console.error('Error saving product:', err)
      alert(id ? 'ไม่สามารถอัพเดทสินค้าได้' : 'ไม่สามารถสร้างสินค้าได้')
    } finally {
      // หยุดแสดงสถานะ loading
      setLoading(false)
    }
  }

  // เริ่มต้น return ของ component
  return (
    // สร้าง container หลักของหน้า ใช้ Tailwind CSS สำหรับการจัดวาง
    <div className="container mx-auto px-4 py-8">
    // แสดงหัวข้อของหน้า ขนาดใหญ่ ตัวหนา และมี margin ด้านล่าง
      // ใช้เงื่อนไขเพื่อแสดงข้อความตามสถานะ (แก้ไขหรือเพิ่มใหม่)
      <h1 className="text-2xl font-bold mb-6">{id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h1>

    // เริ่มต้นฟอร์ม กำหนด event handler สำหรับการ submit และจำกัดความกว้างสูงสุด
      <form onSubmit={handleSubmit} className="max-w-2xl">
      // ส่วนของการอัปโหลดรูปภาพ
        <div className="mb-4">
        // ป้ายกำกับสำหรับรูปภาพสินค้า
          <label className="block mb-2">รูปภาพสินค้า</label>
        // คอนเทนเนอร์สำหรับ preview และ input ไฟล์
          <div className="flex items-center space-x-4">
          // แสดง preview รูปภาพถ้ามี
            {preview && (
              // คอนเทนเนอร์สำหรับรูปภาพ preview
              <div className="w-32 h-32 relative">
              // แสดงรูปภาพ preview
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded"
                />
              // ปุ่มลบรูปภาพ
                <button
                  type="button"
                  // เมื่อคลิกจะลบ preview และรีเซ็ต productImage ใน formData
                  onClick={() => {
                    setPreview(null)
                    setFormData(prev => ({ ...prev, productImage: null }))
                  }}
                  // สไตล์ปุ่มลบ
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            )}
          // input สำหรับอัปโหลดไฟล์
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

      // ฟิลด์กรอกชื่อสินค้า
        <div className="mb-4">
        // ป้ายกำกับสำหรับชื่อสินค้า
          <label className="block mb-2">ชื่อสินค้า</label>
        // input สำหรับกรอกชื่อสินค้า
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
            className="w-full border p-2 rounded"
            required
          />
        </div>

      // ฟิลด์กรอกรายละเอียดสินค้า
        <div className="mb-4">
        // ป้ายกำกับสำหรับรายละเอียดสินค้า
          <label className="block mb-2">รายละเอียด</label>
        // textarea สำหรับกรอกรายละเอียดสินค้า
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full border p-2 rounded"
            rows="4"
            required
          />
        </div>

      // ฟิลด์กรอกราคาสินค้า
        <div className="mb-4">
        // ป้ายกำกับสำหรับราคาสินค้า
          <label className="block mb-2">ราคา</label>
        // input สำหรับกรอกราคาสินค้า
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

      // ฟิลด์กรอกจำนวนสินค้าในคลัง
        <div className="mb-4">
        // ป้ายกำกับสำหรับจำนวนสินค้าในคลัง
          <label className="block mb-2">จำนวนในคลัง</label>
        // input สำหรับกรอกจำนวนสินค้าในคลัง
          <input
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
            className="w-full border p-2 rounded"
            required
            min="0"
          />
        </div>

      // ส่วนของการเลือกหมวดหมู่
        <div className="mb-4">
  // ป้ายกำกับสำหรับหมวดหมู่
          <label className="block mb-2">หมวดหมู่</label>
  // dropdown สำหรับเลือกหมวดหมู่
          <select
            value={formData.categoryID}
            // อัพเดท state เมื่อมีการเลือกหมวดหมู่
            onChange={(e) => setFormData(prev => ({ ...prev, categoryID: e.target.value }))}
            className="w-full border p-2 rounded"
            required
          >
    // ตัวเลือกเริ่มต้น
            <option value="">เลือกหมวดหมู่</option>
    // สร้างตัวเลือกจากข้อมูลหมวดหมู่ที่มี
            {categories.map((category) => (
              <option key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

// ส่วนของการเลือกส่วนลด
        <div className="mb-4">
  // ป้ายกำกับสำหรับส่วนลด
          <label className="block mb-2">ส่วนลด</label>
  // dropdown สำหรับเลือกส่วนลด
          <select
            value={formData.discounts[0]?.discountID || ''}
            onChange={handleDiscountChange}
            className="w-full border p-2 rounded mb-2"
          >
    // ตัวเลือกไม่มีส่วนลด
            <option value="">ไม่มีส่วนลด</option>
    // สร้างตัวเลือกจากข้อมูลส่วนลดที่มี
            {discounts.map((discount) => (
              <option key={discount.discountID} value={discount.discountID}>
                {discount.description} - {discount.discountType === 'percentage'
                  ? `${discount.discountValue}%`
                  : `${discount.discountValue} บาท`}
              </option>
            ))}
          </select>

  // แสดงฟิลด์วันที่เริ่มต้นและสิ้นสุดของส่วนลด ถ้ามีการเลือกส่วนลด
          {formData.discounts.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-2">
      // ฟิลด์วันที่เริ่มต้น
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
      // ฟิลด์วันที่สิ้นสุด
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

// ส่วนของปุ่มดำเนินการ
        <div className="flex space-x-4">
  // ปุ่มบันทึก/อัพเดท
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'กำลังบันทึก...' : (id ? 'อัพเดท' : 'สร้าง')}
          </button>
  // ปุ่มยกเลิก
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