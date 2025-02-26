import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    categoryName: '',
    description: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/backoffice/categories');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`/api/backoffice/categories/${editId}`, formData);
        toast.success('อัพเดทหมวดหมู่สำเร็จ');
      } else {
        await axios.post('/api/backoffice/categories', formData);
        toast.success('เพิ่มหมวดหมู่สำเร็จ');
      }
      setFormData({ categoryName: '', description: '' });
      setEditMode(false);
      setEditId(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'เกิดข้อผิดพลาด');
    }
  };

  // Handle edit
  const handleEdit = (category) => {
    setFormData({
      categoryName: category.categoryName,
      description: category.description || ''
    });
    setEditMode(true);
    setEditId(category.categoryID);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('คุณแน่ใจที่จะลบหมวดหมู่นี้?')) return;
    
    try {
      await axios.delete(`/api/backoffice/categories/${id}`);
      toast.success('ลบหมวดหมู่สำเร็จ');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการลบ');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">จัดการหมวดหมู่สินค้า</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อหมวดหมู่
            </label>
            <input
              type="text"
              value={formData.categoryName}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({ ...prev, categoryName: value }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียด
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({ ...prev, description: value }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {editMode ? 'อัพเดทหมวดหมู่' : 'เพิ่มหมวดหมู่'}
        </button>
        {editMode && (
          <button
            type="button"
            onClick={() => {
              setFormData({ categoryName: '', description: '' });
              setEditMode(false);
              setEditId(null);
            }}
            className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            ยกเลิก
          </button>
        )}
      </form>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ชื่อหมวดหมู่
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                รายละเอียด
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
            {categories.map((category) => (
              <tr key={category.categoryID}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.categoryName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.products?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.categoryID)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  ไม่พบข้อมูลหมวดหมู่
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
