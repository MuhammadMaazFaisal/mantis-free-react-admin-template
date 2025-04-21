import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

// Create a baseQuery for auth endpoints.
const authBaseQuery = commonBaseQuery('auth');

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login', // removed duplicate "auth" prefix
        method: 'POST',
        body: credentials,
      }),
    }),
    getUserDetails: builder.query({
      query: () => '/user-details',
    }),
  }),
});

export const { useLoginMutation, useGetUserDetailsQuery } = authApi;