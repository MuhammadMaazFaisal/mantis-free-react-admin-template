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
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: UserOutlined,
    },
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
      id: 'administrative-expenses',
      title: 'Administrative Expenses',
      type: 'item',
      url: '/administrative-expenses',
      icon: FileTextOutlined,
    },
   
  ],
};

const settings =  {
  id: 'settings',
  title: 'Settings',
  type: 'group',
  children: [
    {
      id: 'product-groups',
      title: 'Product Groups',
      type: 'item',
      url: '/settings/product-groups',
    },
    {
      id: 'charts-of-accounts',
      title: 'Charts of Accounts',
      type: 'item',
      url: '/settings/charts-of-accounts',
    },
    {
      id: 'warehouses',
      title: 'Warehouses',
      type: 'item',
      url: '/settings/warehouses',
    },
    {
      id: 'locations',
      title: 'Locations',
      type: 'item',
      url: '/settings/locations',
    },
    {
      id: 'units',
      title: 'Units',
      type: 'item',
      url: '/settings/units',
    },
    {
      id: 'config',
      title: 'Config',
      type: 'item',
      url: '/settings/config',
    },
    {
      id: 'expense-types',
      title: 'Expense Types',
      type: 'item',
      url: '/settings/expense-types',
    },
    {
      id: 'charges-types',
      title: 'Charges Types',
      type: 'item',
      url: '/settings/charges-types',
    },
  ],
};

const menuItems = {
  items: [ modules, settings],
};

export default menuItems;