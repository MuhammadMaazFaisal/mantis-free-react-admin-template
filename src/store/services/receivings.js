import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const receivingsApi = createApi({
  reducerPath: 'receivingsApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getReceivings: builder.query({
      queryFn: () => ({
        data: [
          { id: 1, party: 'Party A', amount: 500 },
          { id: 2, party: 'Party B', amount: 700 },
        ],
      }),
    }),
  }),
});

export const { useGetReceivingsQuery } = receivingsApi;