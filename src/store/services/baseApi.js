import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

// Global loader state
let loaderCount = 0;
let setGlobalLoader = null;
export const setLoaderSetter = (setter) => { setGlobalLoader = setter; };

const showLoader = () => {
  loaderCount++;
  if (setGlobalLoader) setGlobalLoader(true);
};
const hideLoader = () => {
  loaderCount = Math.max(0, loaderCount - 1);
  if (setGlobalLoader && loaderCount === 0) setGlobalLoader(false);
};

export const commonBaseQuery = (basePath) => async (args, api, extraOptions) => {
  showLoader();
  try {
    const baseQuery = fetchBaseQuery({
      baseUrl: `https://app.agarglobal.co/public/api/${basePath}`,
      prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Accept', 'application/json');
        headers.set('Content-Type', 'application/json');
        headers.set('X-Requested-With', 'XMLHttpRequest');
        return headers;
      },
    });
    const result = await baseQuery(args, api, extraOptions);
    hideLoader();

    // Only show success toast for POST/PUT/DELETE (not GET)
    if (result?.data && result.data.success) {
      if (['POST', 'PUT', 'DELETE'].includes((args.method || '').toUpperCase())) {
        toast.success(result.data.message || 'Operation successful');
      }
    }
    // Do NOT show error toast here; let UI handle it
    return result;
  } catch (err) {
    hideLoader();
    // Do NOT show error toast here; let UI handle it
    throw err;
  }
};