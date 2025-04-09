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
// const ProcessingPayment = Loadable(lazy(() => import('../views/ProcessingPayment')));
// const AdminExpenses = Loadable(lazy(() => import('../views/AdminExpenses')));
// const Settings = Loadable(lazy(() => import('../views/Settings')));
// const Reports = Loadable(lazy(() => import('../views/Reports')));


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
    // { path: '/processing-payment', element: <ProcessingPayment /> },
    // { path: '/admin-expenses', element: <AdminExpenses /> },
    // { path: '/settings', element: <Settings /> },
    // { path: '/reports', element: <Reports /> },
  ],
};

export default MainRoutes;