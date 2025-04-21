import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: commonBaseQuery(''),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    changePassword: builder.mutation({
      query: (data) => ({ url: '/change-password', method: 'POST', body: data }),
      transformResponse: (response) => response.success ? response.data : {},
    }),
    updateProfile: builder.mutation({
      query: (data) => ({ url: '/update-profile', method: 'POST', body: data }),
      transformResponse: (response) => response.success ? response.data : {},
    }),
    updateFinanceInfo: builder.mutation({
      query: (data) => ({ url: '/update-finance', method: 'POST', body: data }),
      transformResponse: (response) => response.success ? response.data : {},
    }),
    getUserDetails: builder.query({
      query: () => '/user-details',
      transformResponse: (response) => response.success ? response.data : {},
    }),
  }),
});

export const { 
  useChangePasswordMutation, 
  useUpdateProfileMutation, 
  useUpdateFinanceInfoMutation, 
  useGetUserDetailsQuery 
} = userApi;