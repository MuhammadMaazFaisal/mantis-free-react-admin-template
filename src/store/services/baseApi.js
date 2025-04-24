import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const commonBaseQuery = (basePath) => fetchBaseQuery({
  baseUrl: `http://test-agar-global.test/api/${basePath}`,
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