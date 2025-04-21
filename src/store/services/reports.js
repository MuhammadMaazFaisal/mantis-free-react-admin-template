import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: commonBaseQuery('reports'),
  tagTypes: ['Report'],
  endpoints: (builder) => ({
    getSalesReport: builder.query({
      query: (params) => ({ url: '/sales', params }),
      transformResponse: (response) => response.success ? response.data : {},
      providesTags: ['Report'],
    }),
    getInventoryReport: builder.query({
      query: (params) => ({ url: '/inventory', params }),
      transformResponse: (response) => response.success ? response.data : {},
      providesTags: ['Report'],
    }),
  }),
});

export const { useGetSalesReportQuery, useGetInventoryReportQuery } = reportsApi;
