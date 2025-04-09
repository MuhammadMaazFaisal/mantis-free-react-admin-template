import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://red-mole-255685.hostingersite.com/public/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from state and set in headers for authorized requests
      const token = getState().auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/products',
      transformResponse: (response) => response.data || [],
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => response.data || {},
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
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