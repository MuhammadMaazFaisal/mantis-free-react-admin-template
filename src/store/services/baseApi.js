import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const commonBaseQuery = (basePath) => fetchBaseQuery({
  baseUrl: `https://agar-global.test/api/${basePath}`,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});