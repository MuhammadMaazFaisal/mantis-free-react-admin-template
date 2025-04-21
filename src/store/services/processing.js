import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const processingApi = createApi({
  reducerPath: 'processingApi',
  baseQuery: commonBaseQuery('processings'),
  tagTypes: ['Processing'],
  endpoints: (builder) => ({
    getProcessings: builder.query({
      query: () => '/',
      transformResponse: (response) => response.success ? response.data : [],
      providesTags: ['Processing'],
    }),
    getProcessingById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.success ? response.data : {},
    }),
    addProcessing: builder.mutation({
      query: (processing) => ({
        url: '/',
        method: 'POST',
        body: processing,
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['Processing'],
    }),
    updateProcessing: builder.mutation({
      query: (processing) => ({
        url: `/${processing.id}`,
        method: 'PUT',
        body: processing,
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['Processing'],
    }),
    deleteProcessing: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['Processing'],
    }),
  }),
});

export const { 
  useGetProcessingsQuery, 
  useGetProcessingByIdQuery,
  useAddProcessingMutation, 
  useUpdateProcessingMutation,
  useDeleteProcessingMutation 
} = processingApi;