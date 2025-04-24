import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: commonBaseQuery(''),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => 'products',
      transformResponse: (response) => response.success ? response.data : [],
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `products/${id}`,
      transformResponse: (response) => response.success ? response.data : {},
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: 'products',
        method: 'POST',
        body: product,
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: product,
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;