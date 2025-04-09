import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getProducts: builder.query({
      queryFn: () => ({
        data: [
          { id: 1, name: 'Product 1', price: 100 },
          { id: 2, name: 'Product 2', price: 200 },
        ],
      }),
    }),
  }),
});

export const { useGetProductsQuery } = productApi;