import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      queryFn: () => ({
        data: [
          {
            id: 1,
            productGroup: 'Rice Raw',
            name: '1121 White Raw',
            unit: 'Kg',
            productQuality: 'none',
            ratePerQty: 0.0,
            dueDays: 120,
            amountAfterDueDays: 0.0,
            details: '',
            active: true,
            addedBy: 'Admin',
            addedOn: '2022-10-24',
            modifiedBy: 'Admin',
            modifiedOn: '2023-04-17',
          },
          {
            id: 2,
            productGroup: 'Rice Raw',
            name: 'Super Karnal Raw',
            unit: 'Kg',
            productQuality: 'none',
            ratePerQty: 0.0,
            dueDays: 120,
            amountAfterDueDays: 0.0,
            details: '',
            active: true,
            addedBy: 'Admin',
            addedOn: '2022-10-24',
            modifiedBy: 'Admin',
            modifiedOn: '2023-04-17',
          },
        ],
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      queryFn: (id) => ({
        data: {
          id,
          productGroup: 'Rice Raw',
          name: `Product ${id}`,
          unit: 'Kg',
          productQuality: 'none',
          ratePerQty: 0.0,
          dueDays: 120,
          amountAfterDueDays: 0.0,
          details: '',
          active: true,
          addedBy: 'Admin',
          addedOn: '2022-10-24',
          modifiedBy: 'Admin',
          modifiedOn: '2023-04-17',
        },
      }),
      providesTags: ['Product'],
    }),
    addProduct: builder.mutation({
      queryFn: (newProduct) => ({ data: { ...newProduct, id: Math.random() } }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      queryFn: (updatedProduct) => ({ data: updatedProduct }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
} = productApi;