import { useState, useEffect } from 'react'
import axios from '../../api/axios'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { Eye } from 'lucide-react'


const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/backoffice/orders`, {
        params: {
          page,
          limit: 10,
          search
        }
      })
      setOrders(response.data.orders)
      setTotalPages(response.data.totalPages)
      setCurrentPage(response.data.currentPage)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('ไม่สามารถดึงข้อมูลออเดอร์ได้')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [search])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchOrders(page)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/backoffice/orders/${orderId}`, {
        status: newStatus
      })
      toast.success('อัพเดทสถานะสำเร็จ')
      fetchOrders(currentPage)
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('ไม่สามารถอัพเดทสถานะได้')
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price)
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const OrderDetailsModal = ({ order, onClose }) => {
    console.log('OrderDetailsModal rendered');

    if (!order) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">รายละเอียดออเดอร์</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">ข้อมูลลูกค้า</h3>
                <p>ชื่อ: {order.customer.firstname} {order.customer.lastname}</p>
                <p>ที่อยู่จัดส่ง: {order.address}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">ข้อมูลออเดอร์</h3>
                <p>รหัสออเดอร์: {order.orderID}</p>
                <p>วันที่สั่งซื้อ: {format(new Date(order.orderdate), 'PPP', { locale: th })}</p>
                <p>สถานะ: <span className={`px-2 py-1 rounded-full text-sm red ${getStatusColor(order.status)}`}>{order.status}</span></p>
              </div>
            </div>

            {order.payment && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">ข้อมูลการชำระเงิน</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">รหัสการชำระเงิน</p>
                          <p className="font-medium">{order.payment.paymentID}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">วันที่ชำระเงิน</p>
                          <p className="font-medium">
                            {format(new Date(order.payment.paymentDate), 'PPP p', { locale: th })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">จำนวนเงิน</p>
                          <p className="font-medium">{formatPrice(order.payment.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ช่องทางการชำระเงิน</p>
                          <p className="font-medium">{order.payment.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                    
                    {order.payment.slip && (
                      <div className="flex flex-col items-center">
                        <p className="text-sm text-gray-600 mb-2">หลักฐานการชำระเงิน</p>
                        <div className="relative group">
                          <img
                            src={order.payment.slip}
                            alt="หลักฐานการชำระเงิน"
                            className="h-32 object-contain cursor-pointer rounded border border-gray-200"
                            onClick={() => window.open(order.payment.slip, '_blank')}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex items-center justify-center">
                            <div className="bg-white px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5">
                              <Eye className="h-4 w-4" />
                              <span className="text-sm"
                              onClick={() => window.open(order.payment.slip, '_blank')}
                              >คลิกเพื่อดูขนาดเต็ม</span>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-semibold mb-4">รายการสินค้า</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">รหัสสินค้า</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">ชื่อสินค้า</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">ราคาต่อชิ้น</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">จำนวน</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">ราคารวม</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.orderDetails.map((detail) => (
                      <tr key={detail.orderDetailID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{detail.product.productID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detail.product.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(detail.price)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{detail.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(detail.price * detail.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-right font-semibold">ยอดรวมทั้งสิ้น</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatPrice(order.totalAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">จัดการออเดอร์</h1>
        <div className="w-64">
          <input
            type="text"
            placeholder="ค้นหาออเดอร์..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                รหัสออเดอร์
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                ลูกค้า
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                วันที่สั่งซื้อ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                ยอดรวม
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                สถานะ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>

          <tbody className="bg-green-50 divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.orderID}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.orderID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.customer.firstname} {order.customer.lastname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(order.orderdate), 'PPP', { locale: th })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <select
                      className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderID, e.target.value)}
                    >
                      <option value="pending">รอดำเนินการ</option>
                      <option value="completed">เสร็จสิ้น</option>
                      <option value="cancelled">ยกเลิก</option>
                    </select>
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="p-2 text-primary hover:text-primary-dark transition-colors"
                      title="ดูรายละเอียด"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  
      <div className="flex justify-center mt-6">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                ${page === currentPage
                  ? 'z-10 bg-primary border-primary text-grey-50'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
            >
              {page}
            </button>
          ))}
        </nav>
      </div>

  
      {showModal && (
  <OrderDetailsModal
    order={selectedOrder}
    onClose={() => {
      console.log('onClose called'); // เพิ่มบรรทัดนี้
      console.log('Before: showModal =', showModal); // เพิ่มบรรทัดนี้
      setShowModal(false);
      setSelectedOrder(null);
      console.log('After: showModal should be true'); // เพิ่มบรรทัดนี้
    }}
        />
      )}
    </div>
  )
}

export default Orders
