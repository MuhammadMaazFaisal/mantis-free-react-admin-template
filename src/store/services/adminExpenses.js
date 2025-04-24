import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const adminExpensesApi = createApi({
  reducerPath: 'adminExpensesApi',
  baseQuery: commonBaseQuery(''),
  tagTypes: ['AdministrativeExpense'],
  endpoints: (builder) => ({
    getAdministrativeExpenses: builder.query({
      query: () => 'administrative-expenses',
      transformResponse: (response) => response.success ? response.data : [],
      providesTags: ['AdministrativeExpense'],
    }),
    getAdministrativeExpenseById: builder.query({
      query: (id) => `administrative-expenses/${id}`,
      transformResponse: (response) => response.success ? response.data : {},
    }),
    addAdministrativeExpense: builder.mutation({
      query: (newExpense) => ({
        url: 'administrative-expenses',
        method: 'POST',
        body: newExpense,
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['AdministrativeExpense'],
    }),
    updateAdministrativeExpense: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `administrative-expenses/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['AdministrativeExpense'],
    }),
    deleteAdministrativeExpense: builder.mutation({
      query: (id) => ({
        url: `administrative-expenses/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['AdministrativeExpense'],
    }),
  }),
});

export const { 
  useGetAdministrativeExpensesQuery,
  useGetAdministrativeExpenseByIdQuery,
  useAddAdministrativeExpenseMutation,
  useUpdateAdministrativeExpenseMutation,
  useDeleteAdministrativeExpenseMutation 
} = adminExpensesApi;