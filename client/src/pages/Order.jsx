import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadingOrderId, setUploadingOrderId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_URL_SERVER_API}/api/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถดึงข้อมูลรายการสั่งซื้อได้'
            });
        }
    };

    const handleFileSelect = (event, orderID) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setUploadingOrderId(orderID);

            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !uploadingOrderId) return;

        try {
            // สร้าง FormData
            const formData = new FormData();
            formData.append('slip', selectedFile);

            // แสดง loading
            Swal.fire({
                title: 'กำลังอัพโหลด...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await axios.post(
                `${import.meta.env.VITE_URL_SERVER_API}/api/orders/slip/${uploadingOrderId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // รีเซ็ตสถานะ
            setSelectedFile(null);
            setPreviewUrl(null);
            setUploadingOrderId(null);

            // รีเฟรชข้อมูล
            fetchOrders();

            Swal.fire({
                icon: 'success',
                title: 'อัพโหลดสลิปสำเร็จ',
                text: 'ระบบกำลังตรวจสอบการชำระเงิน'
            });
        } catch (error) {
            console.error('Upload error:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.response?.data?.message || 'ไม่สามารถอัพโหลดสลิปได้'
            });
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadingOrderId(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">รายการสั่งซื้อของฉัน</h1>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">ยังไม่มีรายการสั่งซื้อ</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.orderID} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">รหัสคำสั่งซื้อ: {order.orderID}</p>
                                    <p className="text-sm text-gray-500">วันที่สั่งซื้อ: {formatDate(order.orderdate)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold">฿{order.totalAmount.toFixed(2)}</p>
                                    <span className={`badge ${order.status === 'pending' ? 'badge-warning' :
                                        order.status === 'paid' ? 'badge-info' :
                                            order.status === 'completed' ? 'badge-success' :
                                                'badge-error'
                                        }`}>
                                        {order.status === 'pending' ? 'รอชำระเงิน' :
                                            order.status === 'paid' ? 'รอตรวจสอบ' :
                                                order.status === 'completed' ? 'สำเร็จ' :
                                                    'ยกเลิก'}
                                    </span>
                                </div>
                            </div>

                            <div className="divide-y">
                                {order.orderDetails.map((item) => (
                                    <div key={item.orderDetailID} className="py-4 flex items-center">
                                        <div className="ml-4 flex-grow">
                                            <h3 className="font-medium">{item.product.productName}</h3>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} ชิ้น x ฿{item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">฿{(item.quantity * item.price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-600">ที่อยู่จัดส่ง:</p>
                                        <p className="text-sm">{order.address}</p>
                                    </div>

                                    <div className="text-right">
                                        {/* แสดงปุ่มอัพโหลดสลิปเฉพาะเมื่อสถานะเป็น pending */}
                                        {order.status === 'pending' && (
                                            <div>
                                                {uploadingOrderId === order.orderID ? (
                                                    <div className="space-y-4">
                                                        {previewUrl && (
                                                            <div className="relative w-40">
                                                                <img
                                                                    src={previewUrl}
                                                                    alt="preview"
                                                                    className="w-full h-auto rounded"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={handleUpload}
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                ยืนยันการอัพโหลด
                                                            </button>
                                                            <button
                                                                onClick={handleCancel}
                                                                className="btn btn-ghost btn-sm"
                                                            >
                                                                ยกเลิก
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileSelect(e, order.orderID)}
                                                            className="hidden"
                                                            id={`slip-${order.orderID}`}
                                                        />
                                                        <label
                                                            htmlFor={`slip-${order.orderID}`}
                                                            className="btn btn-primary cursor-pointer"
                                                        >
                                                            อัพโหลดสลิป
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* แสดงข้อมูลการชำระเงิน */}
                                        {order.payment && (
                                            <div className="mt-4">
                                                <p className="text-gray-600 mb-1">ข้อมูลการชำระเงิน:</p>
                                                <p className="text-sm">วันที่ชำระ: {formatDate(order.payment.paymentDate)}</p>
                                                <p className="text-sm">จำนวนเงิน: ฿{order.payment.amount.toFixed(2)}</p>
                                                <p className="text-sm">วิธีชำระ: {
                                                    order.payment.paymentMethod === 'bank_transfer' ? 'โอนเงินนนนน' : order.payment.paymentMethod
                                                }</p>
                                                {order.payment.slip && (
                                                    <div className="mt-2">
                                                        <p className="text-gray-600 mb-1">สลิปการโอนเงิน:</p>
                                                        <img
                                                            src={order.payment.slip}
                                                            alt="สลิปการโอนเงิน"
                                                            className="w-40 h-auto rounded cursor-pointer"
                                                            onClick={() => {
                                                                Swal.fire({
                                                                    imageUrl: order.payment.slip,
                                                                    imageAlt: 'สลิปการโอนเงิน',
                                                                    showConfirmButton: false,
                                                                    showCloseButton: true
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;