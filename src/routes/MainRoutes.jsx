import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute';

// render - Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - component overview
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// Party module
const Party = Loadable(lazy(() => import('../views/Party')));
const Product = Loadable(lazy(() => import('../views/Product')));
const Receivings = Loadable(lazy(() => import('../views/Receivings')));
const Processing = Loadable(lazy(() => import('../views/Processing')));
const ProcessingPayment = Loadable(lazy(() => import('../views/ProcessingPayment')));
const AdministrativeExpenses = Loadable(lazy(() => import('../views/AdministrativeExpenses')));

// Settings sub-modules
const ProductGroups = Loadable(lazy(() => import('../views/settings/ProductGroups')));
const ChartsOfAccounts = Loadable(lazy(() => import('../views/settings/ChartsOfAccounts')));
const Warehouses = Loadable(lazy(() => import('../views/settings/Warehouses')));
const Locations = Loadable(lazy(() => import('../views/settings/Locations')));
const Units = Loadable(lazy(() => import('../views/settings/Units')));
const Config = Loadable(lazy(() => import('../views/settings/Config')));
const ExpenseTypes = Loadable(lazy(() => import('../views/settings/ExpenseTypes')));
const ChargesTypes = Loadable(lazy(() => import('../views/settings/ChargesTypes')));

// Reports sub-modules
const StockReport = Loadable(lazy(() => import('../views/reports/StockReport')));
const PartyLedger = Loadable(lazy(() => import('../views/reports/PartyLedger')));
const LotLedger = Loadable(lazy(() => import('../views/reports/LotLedger')));
const TrialBalanceReport = Loadable(lazy(() => import('../views/reports/TrialBalanceReport')));
const ReceivableReport = Loadable(lazy(() => import('../views/reports/ReceivableReport')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />,
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />,
        },
      ],
    },
    {
      path: 'typography',
      element: <Typography />,
    },
    {
      path: 'color',
      element: <Color />,
    },
    {
      path: 'shadow',
      element: <Shadow />,
    },
    {
      path: 'sample-page',
      element: <SamplePage />,
    },
    { path: '/party', element: <Party /> },
    { path: '/product', element: <Product /> },
    { path: '/receivings', element: <Receivings /> },
    { path: '/processing', element: <Processing /> },
    { path: '/processing-payment', element: <ProcessingPayment /> },
    { path: '/administrative-expenses', element: <AdministrativeExpenses /> },
    {
      path: 'settings',
      children: [
        {
          path: 'product-groups',
          element: <ProductGroups />,
        },
        {
          path: 'charts-of-accounts',
          element: <ChartsOfAccounts />,
        },
        {
          path: 'warehouses',
          element: <Warehouses />,
        },
        {
          path: 'locations',
          element: <Locations />,
        },
        {
          path: 'units',
          element: <Units />,
        },
        {
          path: 'config',
          element: <Config />,
        },
        {
          path: 'expense-types',
          element: <ExpenseTypes />,
        },
        {
          path: 'charges-types',
          element: <ChargesTypes />,
        },
      ],
    },
    {
      path: 'reports',
      children: [
        {
          path: 'stock-report',
          element: <StockReport />,
        },
        {
          path: 'party-ledger',
          element: <PartyLedger />,
        },
        {
          path: 'lot-ledger',
          element: <LotLedger />,
        },
        {
          path: 'trial-balance-report',
          element: <TrialBalanceReport />,
        },
        {
          path: 'receivable-report',
          element: <ReceivableReport />,
        },
      ],
    },
  ],
};

export default MainRoutes;