import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const processingApi = createApi({
  reducerPath: 'processingApi',
  baseQuery: commonBaseQuery,
  tagTypes: ['Processing'],
  endpoints: (builder) => ({
    getProcessings: builder.query({
      query: () => '/processings',
      providesTags: ['Processing'],
    }),
    addProcessing: builder.mutation({
      query: (processing) => ({
        url: '/processings',
        method: 'POST',
        body: processing,
      }),
      invalidatesTags: ['Processing'],
    }),
    updateProcessing: builder.mutation({
      query: (processing) => ({
        url: `/processings/${processing.id}`,
        method: 'PUT',
        body: processing,
      }),
      invalidatesTags: ['Processing'],
    }),
  }),
});

export const { useGetProcessingsQuery, useAddProcessingMutation, useUpdateProcessingMutation } = processingApi;