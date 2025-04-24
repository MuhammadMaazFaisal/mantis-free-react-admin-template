import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: commonBaseQuery(''),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => '/dashboard',
    })
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
