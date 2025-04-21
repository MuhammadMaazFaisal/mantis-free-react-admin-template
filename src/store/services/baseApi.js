import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://agar-global.test/api';
export const commonBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL, // only the base url is set here
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token || localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
