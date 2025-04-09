import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const partyApi = createApi({
  reducerPath: 'partyApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Party'],
  endpoints: (builder) => ({
    getParties: builder.query({
      queryFn: () => ({
        data: [
          {
            id: 1,
            name: 'S A Rice',
            address: '',
            contactNumber: '',
            discount: 0.0,
            openingBalanceDate: '2022-12-23',
            openingBalance: 0.0,
            remarks: '',
            active: true,
          },
          {
            id: 2,
            name: 'Siraj Rice',
            address: '',
            contactNumber: '',
            discount: 0.0,
            openingBalanceDate: '2023-05-30',
            openingBalance: 0.0,
            remarks: '',
            active: true,
          },
          // Add more dummy data as needed
        ],
      }),
      providesTags: ['Party'],
    }),
    getPartyById: builder.query({
      queryFn: (id) => ({
        data: {
          id,
          name: `Party ${id}`,
          address: '',
          contactNumber: '',
          discount: 0.0,
          openingBalanceDate: '2023-10-12',
          openingBalance: 0.0,
          remarks: '',
          active: true,
        },
      }),
      providesTags: ['Party'],
    }),
    addParty: builder.mutation({
      queryFn: (newParty) => ({ data: { ...newParty, id: Math.random() } }),
      invalidatesTags: ['Party'],
    }),
    updateParty: builder.mutation({
      queryFn: (updatedParty) => ({ data: updatedParty }),
      invalidatesTags: ['Party'],
    }),
  }),
});

export const {
  useGetPartiesQuery,
  useGetPartyByIdQuery,
  useAddPartyMutation,
  useUpdatePartyMutation,
} = partyApi;