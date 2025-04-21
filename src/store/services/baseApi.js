import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const commonBaseQuery = (basePath) => fetchBaseQuery({
  baseUrl: `https://agar-global.test/api/${basePath}`,
  prepareHeaders: (headers, { getState }) => {
    // Add authentication headers if needed (from prior authslice context)
    const token = getState().auth.token; // Assuming authslice stores token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});