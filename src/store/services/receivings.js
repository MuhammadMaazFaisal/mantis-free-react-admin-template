import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const receivingsApi = createApi({
  reducerPath: 'receivingsApi',
  baseQuery: commonBaseQuery(''),
  tagTypes: ['Receiving'],
  endpoints: (builder) => ({
    getReceivings: builder.query({
      query: () => 'receivings',
      transformResponse: (response) => response.success ? response.data : [],
      providesTags: ['Receiving'],
    }),
    getReceivingById: builder.query({
      query: (id) => `receivings/${id}`,
      transformResponse: (response) => response.success ? response.data : {},
      providesTags: (result, error, id) => [{ type: 'Receiving', id }],
    }),
    addReceiving: builder.mutation({
      query: (newReceiving) => ({
        url: 'receivings',
        method: 'POST',
        body: newReceiving,
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['Receiving'],
    }),
    updateReceiving: builder.mutation({
      query: (updatedReceiving) => ({
        url: `receivings/${updatedReceiving.id}`,
        method: 'PUT',
        body: updatedReceiving,
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: (result, error, { id }) => [{ type: 'Receiving', id }],
    }),
    deleteReceiving: builder.mutation({
      query: (id) => ({
        url: `receivings/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['Receiving'],
    }),
  }),
});

export const {
  useGetReceivingsQuery,
  useGetReceivingByIdQuery,
  useAddReceivingMutation,
  useUpdateReceivingMutation,
  useDeleteReceivingMutation,
} = receivingsApi;