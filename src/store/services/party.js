import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const partyApi = createApi({
  reducerPath: 'partyApi',
  baseQuery: commonBaseQuery('party'),
  tagTypes: ['Party'],
  endpoints: (builder) => ({
    getParties: builder.query({
      query: () => '/parties',
      providesTags: ['Party'],
      transformResponse: (response) => response.data || [],
    }),
    getPartyById: builder.query({
      query: (id) => `/parties/${id}`,
      providesTags: ['Party'],
    }),
    addParty: builder.mutation({
      query: (newParty) => ({
        url: '/parties',
        method: 'POST',
        body: newParty,
      }),
      invalidatesTags: ['Party'],
    }),
    updateParty: builder.mutation({
      query: (updatedParty) => ({
        url: `/parties/${updatedParty.id}`,
        method: 'PUT',
        body: updatedParty,
      }),
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