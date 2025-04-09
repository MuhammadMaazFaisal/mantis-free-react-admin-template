import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <Provider store={store}>
      <ThemeCustomization>
        <ScrollTop>
          <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router} />
          </Suspense>
        </ScrollTop>
      </ThemeCustomization>
    </Provider>
  );
}