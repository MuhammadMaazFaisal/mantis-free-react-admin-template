import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

const authBaseQuery = commonBaseQuery('auth');

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({ 
        url: '/login', 
        method: 'POST', 
        body: credentials 
      }),
    }),
    getUserDetails: builder.query({
      query: () => '/user-details',
    }),
    register: builder.mutation({
      query: (newUser) => ({ 
        url: '/register', 
        method: 'POST', 
        body: newUser 
      }),
      transformResponse: (response) => response.success ? response.data : {},
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({ 
        url: '/verify-otp', 
        method: 'POST', 
        body: data 
      }),
      transformResponse: (response) => response.success ? response.data : {},
    }),
    sendOtp: builder.mutation({
      query: (data) => ({ 
        url: '/send-otp', 
        method: 'POST', 
        body: data 
      }),
      transformResponse: (response) => response.success ? response.data : {},
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({ 
        url: '/forgot-password', 
        method: 'POST', 
        body: data 
      }),
      transformResponse: (response) => response.success ? response.data : {},
    }),
  }),
});

export const { 
  useLoginMutation, 
  useGetUserDetailsQuery,
  useRegisterMutation,
  useVerifyOtpMutation,
  useSendOtpMutation,
  useForgotPasswordMutation 
} = authApi;