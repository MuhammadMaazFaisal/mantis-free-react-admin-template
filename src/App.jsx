import React, { Suspense, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import Loader from './components/Loader';
import { setLoaderSetter } from './store/services/baseApi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setLoaderSetter(setShowLoader);
  }, []);

  return (
    <Provider store={store}>
      <ThemeCustomization>
        <ScrollTop>
          <Suspense fallback={<div>Loading...</div>}>
            {showLoader && <Loader />}
            <RouterProvider router={router} />
            <ToastContainer position="top-right" />
          </Suspense>
        </ScrollTop>
      </ThemeCustomization>
    </Provider>
  );
}