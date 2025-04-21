import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const partyApi = createApi({
  reducerPath: 'partyApi',
  baseQuery: commonBaseQuery(''),
  tagTypes: ['Party'],
  endpoints: (builder) => ({
    getParties: builder.query({
      query: () => '/parties',
      providesTags: ['Party'],
      transformResponse: (response) => response.success ? response.data : [],
      transformErrorResponse: (error) => { 
        console.error('getParties error:', error); 
        return error; 
      },
    }),
    getPartyById: builder.query({
      query: (id) => `/parties/${id}`,
      providesTags: ['Party'],
      transformResponse: (response) => response.success ? response.data : {},
      transformErrorResponse: (error) => { 
        console.error('getPartyById error:', error); 
        return error; 
      },
    }),
    addParty: builder.mutation({
      query: (newParty) => ({
        url: '/parties',
        method: 'POST',
        body: newParty,
      }),
      invalidatesTags: ['Party'],
      transformResponse: (response) => response.success ? response.data : {},
      transformErrorResponse: (error) => { 
        console.error('addParty error:', error); 
        return error; 
      },
    }),
    updateParty: builder.mutation({
      query: (updatedParty) => ({
        url: `/parties/${updatedParty.id}`,
        method: 'PUT',
        body: updatedParty,
      }),
      invalidatesTags: ['Party'],
      transformResponse: (response) => response.success ? response.data : {},
      transformErrorResponse: (error) => { 
        console.error('updateParty error:', error); 
        return error; 
      },
    }),
    deleteParty: builder.mutation({
      query: (id) => ({
        url: `/parties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Party'],
      transformResponse: (response) => response.success ? response.data : {},
      transformErrorResponse: (error) => { 
        console.error('deleteParty error:', error); 
        return error; 
      },
    }),
  }),
});

export const {
  useGetPartiesQuery,
  useGetPartyByIdQuery,
  useAddPartyMutation,
  useUpdatePartyMutation,
  useDeletePartyMutation,
} = partyApi;