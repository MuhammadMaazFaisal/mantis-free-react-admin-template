// project import
import dashboard from './dashboard';
import pages from './page';
import utilities from './utilities';
import support from './support';
import {
  UserOutlined,
  ShoppingOutlined,
  DownloadOutlined,
  SettingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const modules = {
  id: 'modules',
  title: 'Modules',
  type: 'group',
  children: [
    {
      id: 'party',
      title: 'Party',
      type: 'item',
      url: '/party',
      icon: UserOutlined,
    },
    {
      id: 'product',
      title: 'Product',
      type: 'item',
      url: '/product',
      icon: ShoppingOutlined,
    },
    {
      id: 'receivings',
      title: 'Receivings',
      type: 'item',
      url: '/receivings',
      icon: DownloadOutlined,
    },
    {
      id: 'processing',
      title: 'Processing',
      type: 'item',
      url: '/processing',
      icon: ShoppingOutlined,
    },
    {
      id: 'processing-payment',
      title: 'Processing Payment',
      type: 'item',
      url: '/processing-payment',
      icon: DownloadOutlined,
    },
    {
      id: 'admin-expenses',
      title: 'Admin Expenses',
      type: 'item',
      url: '/admin-expenses',
      icon: FileTextOutlined,
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/settings',
      icon: SettingOutlined,
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/reports',
      icon: FileTextOutlined,
    },
  ],
};
const menuItems = {
  items: [dashboard, modules]
};

export default menuItems;
