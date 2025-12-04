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
  FileSearchOutlined,
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

const reports = {
  id: 'reports',
  title: 'Reports',
  type: 'group',
  icon: FileSearchOutlined,
  children: [
    {
      id: 'stock-report',
      title: 'Stock Report',
      type: 'item',
      url: 'https://docs.google.com/spreadsheets/d/1SdxzQFyktR64RuDVRGWo6PRu_QRX23cbtSNYKFmzb1I/edit?gid=457511393#gid=457511393',
    },
    {
      id: 'contract',
      title: 'Contract',
      type: 'item',
      url: 'https://docs.google.com/spreadsheets/d/1e0kns-gvUbCv7dS8NK-YGWzQPD6fmtc75-xAVNhwoE4/edit?gid=0#gid=0',
    },
    {
      id: 'party-ledger',
      title: 'Party Ledger',
      type: 'item',
      url: '/reports/party-ledger',
    },
    {
      id: 'lot-ledger',
      title: 'Lot Ledger',
      type: 'item',
      url: '/reports/lot-ledger',
    },
    {
      id: 'trial-balance-report',
      title: 'Trial Balance Report',
      type: 'item',
      url: '/reports/trial-balance-report',
    },
    {
      id: 'receivable-report',
      title: 'Receivable Report',
      type: 'item',
      url: '/reports/receivable-report',
    },
  ],
}

const menuItems = {
  items: [ modules, settings,reports],
};

export default menuItems;