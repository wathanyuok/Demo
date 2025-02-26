// backoffice/src/routes/routeConfig.js
import { LayoutGrid, Package, Tags, Settings, Percent } from 'lucide-react'


export const menuItems = [
  {
    path: '/',
    name: 'แดชบอร์ด',
    icon: LayoutGrid,
    showInMenu: true
  },
  {
    path: '/products',
    name: 'จัดการสินค้า',
    icon: Package,
    showInMenu: true
  },
  {
    path: '/categories',
    name: 'ประเภทสินค้า',
    icon: Tags,
    showInMenu: true
  },
  {
    path: '/orders',
    name: 'จัดการออเดอร์',
    icon: Tags,
    showInMenu: true
  }
]