// นำเข้า React hooks ที่จำเป็น เช่น useState และ useEffect
import { useState, useEffect } from 'react'
// นำเข้า Link สำหรับการสร้างลิงก์, useNavigate สำหรับการนำทาง, และ useSearchParams สำหรับจัดการ query parameters
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
// นำเข้า axios instance ที่กำหนดค่าไว้แล้วสำหรับเรียก API
import axios from '../../api/axios'
// นำเข้า context สำหรับจัดการข้อมูลผู้ใช้ที่เข้าสู่ระบบ (authentication)
import { useAuth } from '../../contexts/AuthContext'

// ประกาศ component Products ซึ่งเป็นฟังก์ชันหลักของหน้าแสดงรายการสินค้า
export default function Products() {
  // สร้างตัวแปร navigate เพื่อใช้สำหรับนำทางไปยังหน้าอื่น
  const navigate = useNavigate()
  // สร้างตัวแปร searchParams และ setSearchParams เพื่อจัดการ query parameters ใน URL
  const [searchParams, setSearchParams] = useSearchParams()

  // สร้าง state สำหรับเก็บข้อมูลสินค้า
  const [products, setProducts] = useState([])
  // สร้าง state สำหรับแสดงสถานะ loading ขณะโหลดข้อมูล
  const [loading, setLoading] = useState(true)
  // สร้าง state สำหรับเก็บข้อความข้อผิดพลาด ถ้ามีปัญหาในการโหลดข้อมูล
  const [error, setError] = useState(null)
  // สร้าง state สำหรับเก็บคำค้นหาสินค้า โดยค่าเริ่มต้นจะดึงจาก query parameter 'search'
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  // สร้าง state สำหรับจัดการข้อมูลการแบ่งหน้า (pagination)
  const [pagination, setPagination] = useState({
    currentPage: Number(searchParams.get('page')) || 1, // หน้าปัจจุบัน (เริ่มจาก query parameter 'page')
    totalPages: 1, // จำนวนหน้าทั้งหมด (ค่าเริ่มต้นคือ 1)
    totalItems: 0, // จำนวนสินค้าทั้งหมด
    itemsPerPage: 10 // จำนวนสินค้าต่อหน้า (ค่าเริ่มต้นคือ 10)
  })
  // ดึง token จาก AuthContext เพื่อใช้สำหรับยืนยันตัวตนกับ API
  const { token } = useAuth()

  // ใช้ useEffect เพื่อตรวจสอบ token และตั้งค่า header ของ axios เมื่อ component ถูกโหลดครั้งแรก
  useEffect(() => {
    const token = localStorage.getItem('token') // ดึง token จาก localStorage
    if (!token) { // ถ้าไม่มี token ให้ส่งผู้ใช้ไปที่หน้า login
      navigate('/login')
      return
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}` // ตั้งค่า Authorization header ให้กับ axios
  }, [navigate])

  // ใช้ useEffect เพื่อตรวจสอบการเปลี่ยนแปลงของ searchParams และเรียก fetchProducts เพื่อโหลดข้อมูลสินค้าใหม่
  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้าจาก API
  const fetchProducts = async () => {
    try {
      const page = searchParams.get('page') || 1 // ดึงหมายเลขหน้าจาก query parameter 'page'
      const search = searchParams.get('search') || '' // ดึงคำค้นหาจาก query parameter 'search'

      // ส่ง request ไปยัง API เพื่อดึงข้อมูลสินค้า โดยส่ง query parameters page, search และ limit ไปด้วย
      const response = await axios.get('/api/backoffice/products', {
        params: {
          page,
          search,
          limit: pagination.itemsPerPage
        },
        headers: {
          Authorization: `Bearer ${token}` // ส่ง token ใน header เพื่อยืนยันตัวตน
        }
      })

      // อัปเดต state ด้วยข้อมูลสินค้าที่ได้รับจาก API
      setProducts(response.data.products) // เก็บรายการสินค้าใน state products
      setPagination({
        ...pagination,
        currentPage: Number(page), // อัปเดตหน้าปัจจุบันตาม query parameter 'page'
        totalPages: response.data.totalPages, // อัปเดตจำนวนหน้าทั้งหมดจาก API
        totalItems: response.data.totalItems // อัปเดตจำนวนสินค้าทั้งหมดจาก API
      })
      setError(null) // ล้างข้อความข้อผิดพลาด (ถ้ามี)
    } catch (err) {
      if (err.response?.status === 401) { // ถ้าเกิดข้อผิดพลาด HTTP status code 401 (Unauthorized)
        localStorage.removeItem('token') // ลบ token ออกจาก localStorage
        localStorage.removeItem('user') // ลบข้อมูลผู้ใช้ออกจาก localStorage
        navigate('/login') // ส่งผู้ใช้ไปที่หน้า login
        return
      }
      setError('ไม่สามารถโหลดข้อมูลสินค้าได้') // ตั้งค่าข้อความข้อผิดพลาดใน state error
      console.error('Error fetching products:', err) // แสดงข้อผิดพลาดใน console สำหรับ debug
    } finally {
      setLoading(false) // ปิดสถานะ loading หลังจากโหลดเสร็จสิ้น (ไม่ว่าจะสำเร็จหรือเกิดข้อผิดพลาด)
    }
  }

  // ฟังก์ชันจัดการการค้นหา เมื่อผู้ใช้กรอกคำค้นหาและกดปุ่มค้นหา
  const handleSearch = (e) => {
    e.preventDefault() // ป้องกันไม่ให้ฟอร์ม reload หน้าเว็บเมื่อกด submit
    setSearchParams({
      page: 1, // รีเซ็ตให้เริ่มที่หน้าแรกเมื่อมีการค้นหาใหม่
      search: searchTerm // ตั้งค่าคำค้นหาใน query parameter 'search'
    })
  }

  // ฟังก์ชันจัดการการเปลี่ยนหน้า เมื่อผู้ใช้คลิกปุ่มเปลี่ยนหน้า (ก่อนหน้า/ถัดไป)
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return // ป้องกันการเปลี่ยนไปหน้าที่อยู่นอกขอบเขต

    setSearchParams({
      page: newPage, // ตั้งค่าหน้าใหม่ใน query parameter 'page'
      ...(searchTerm && { search: searchTerm }) // ถ้ามีคำค้นหา ให้คงไว้ใน query parameter 'search'
    })
  }

  // ฟังก์ชันจัดการการลบสินค้า เมื่อผู้ใช้คลิกปุ่มลบสินค้าในแต่ละแถวของตารางสินค้า
  const handleDelete = async (productID) => {
    if (!window.confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) return // แสดงข้อความยืนยันก่อนลบ

    try {
      await axios.delete(`/api/backoffice/products/${productID}`, {
        headers: {
          Authorization: `Bearer ${token}` // ส่ง token ใน header เพื่อยืนยันตัวตนกับ API 
        }
      })
      fetchProducts() // โหลดข้อมูลสินค้าใหม่หลังจากลบสำเร็จ
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

  // แสดง loading indicator ถ้ากำลังโหลดข้อมูลสินค้า
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        {/* วงกลมหมุนแสดงสถานะกำลังโหลด */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // เริ่มต้นการแสดงผลของ component
  return (
    // คอนเทนเนอร์หลักของหน้า ใช้ padding รอบด้าน
    <div className="p-6">
      ส่วนหัวของหน้า แสดงชื่อ "จัดการสินค้า" และปุ่มเพิ่มสินค้า
      <div className="flex justify-between items-center mb-6">
      // หัวข้อของหน้า
        <h1 className="text-2xl font-bold text-gray-800">จัดการสินค้า</h1>
      // ปุ่มลิงก์ไปยังหน้าสำหรับเพิ่มสินค้าใหม่
        <Link
          to="/products/add" // ลิงก์ไปยังหน้าสำหรับเพิ่มสินค้าใหม่
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          เพิ่มสินค้า
        </Link>
      </div>

    // ฟอร์มสำหรับค้นหาสินค้า
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
        // ช่องกรอกคำค้นหา
          <input
            type="text" // กำหนดให้เป็น input ชนิดข้อความ
            value={searchTerm} // คำที่ผู้ใช้กรอกในช่องค้นหา
            onChange={(e) => setSearchTerm(e.target.value)} // อัปเดต state searchTerm เมื่อผู้ใช้พิมพ์ข้อความ
            placeholder="ค้นหาสินค้า..." // ข้อความตัวอย่างในช่องค้นหา
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" // สไตล์ของ input (ใช้ Tailwind CSS)
          />
        // ปุ่มสำหรับกดค้นหา
          <button
            type="submit" // กำหนดให้ปุ่มนี้เป็นปุ่ม submit ของฟอร์ม
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ค้นหา
          </button>
        </div>
      </form>

    // ถ้ามีข้อผิดพลาด ให้แสดงข้อความข้อผิดพลาดและปุ่มลองใหม่
      {error ? (
        <div className="text-center text-red-600 p-4">
          <p>{error}</p> {/* แสดงข้อความข้อผิดพลาด */}
          <button
            onClick={fetchProducts} // เรียกฟังก์ชัน fetchProducts เพื่อโหลดข้อมูลใหม่
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ลองใหม่ {/* ปุ่มลองใหม่ */}
          </button>
        </div>
      ) : (
        <>
          {/* ส่วนของตารางแสดงรายการสินค้า */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              {/* ส่วนหัวของตาราง */}
              <thead className="bg-gray-50">
                <tr>
                  {/* คอลัมน์สำหรับหัวข้อในตาราง */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รูปภาพ {/* คอลัมน์สำหรับรูปภาพสินค้า */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อสินค้า {/* คอลัมน์สำหรับชื่อสินค้า */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ราคา {/* คอลัมน์สำหรับราคาสินค้า */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จำนวน {/* คอลัมน์สำหรับจำนวนสินค้า */}
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ {/* คอลัมน์สำหรับปุ่มจัดการ (แก้ไข/ลบ) */}
                  </th>
                </tr>
              </thead>


              // ส่วนเนื้อหาของตาราง (แสดงข้อมูลสินค้า)
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
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
                      <div className="text-sm text-gray-900">
                        ฿{product.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${product.stockQuantity < 10 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {product.stockQuantity}
                      </div>
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
                ))}
              </tbody>


// ปิดตาราง
            </table>

// ปิด container ของตาราง
          </div>


          // คอนเทนเนอร์สำหรับส่วนการแบ่งหน้า (Pagination)
          <div className="mt-4 flex justify-between items-center">
  // แสดงข้อความจำนวนรายการที่แสดงผลและจำนวนรายการทั้งหมด
            <div className="text-sm text-gray-700">
              แสดง {products.length} รายการ จากทั้งหมด {pagination.totalItems} รายการ
            </div>

  // คอนเทนเนอร์สำหรับปุ่มเปลี่ยนหน้า
            <div className="flex gap-2">
    // ปุ่มย้อนกลับหน้าก่อนหน้า
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)} // เรียกฟังก์ชัน handlePageChange เพื่อเปลี่ยนไปหน้าก่อนหน้า
                disabled={pagination.currentPage === 1} // ปิดการใช้งานปุ่มถ้าอยู่ที่หน้าแรกแล้ว
                className="px-4 py-2 border rounded-lg disabled:opacity-50" // สไตล์ของปุ่ม พร้อมลดความโปร่งใสเมื่อปิดการใช้งาน
              >
                ก่อนหน้า {/* ข้อความในปุ่ม */}
              </button>

    // คอนเทนเนอร์สำหรับปุ่มหมายเลขหน้า
              <div className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, i) => ( // สร้าง array ตามจำนวนหน้าทั้งหมดแล้ววนลูป
                  // ปุ่มหมายเลขหน้า
                  <button
                    key={i + 1} // ใช้ index + 1 เป็น key ของแต่ละปุ่ม
                    onClick={() => handlePageChange(i + 1)} // เรียกฟังก์ชัน handlePageChange เพื่อเปลี่ยนไปหน้าที่เลือก
                    className={`px-4 py-2 rounded-lg ${pagination.currentPage === i + 1
                      ? 'bg-blue-600 text-white' // ถ้าเป็นหน้าปัจจุบัน ให้เปลี่ยนสีพื้นหลังเป็นสีน้ำเงินและข้อความเป็นสีขาว
                      : 'border hover:bg-gray-50' // ถ้าไม่ใช่หน้าปัจจุบัน ให้มี border และเปลี่ยนสีเมื่อ hover
                      }`}
                  >
                    {i + 1} {/* แสดงหมายเลขหน้า */}
                  </button>
                ))}
              </div>

    // ปุ่มไปหน้าถัดไป
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)} // เรียกฟังก์ชัน handlePageChange เพื่อเปลี่ยนไปหน้าถัดไป
                disabled={pagination.currentPage === pagination.totalPages} // ปิดการใช้งานปุ่มถ้าอยู่ที่หน้าสุดท้ายแล้ว
                className="px-4 py-2 border rounded-lg disabled:opacity-50" // สไตล์ของปุ่ม พร้อมลดความโปร่งใสเมื่อปิดการใช้งาน
              >
                ถัดไป {/* ข้อความในปุ่ม */}
              </button>
            </div>
          </div>




        </>
      )}
    </div>
  )
}