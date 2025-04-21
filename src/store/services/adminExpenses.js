import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const administrativeExpensesApi = createApi({
  reducerPath: 'administrativeExpensesApi',
  baseQuery: commonBaseQuery('administrative-expenses'),
  tagTypes: ['AdministrativeExpense'],
  endpoints: (builder) => ({
    getAdministrativeExpenses: builder.query({
      query: () => '/',
      transformResponse: (response) => response.success ? response.data : [],
      providesTags: ['AdministrativeExpense'],
    }),
    getAdministrativeExpenseById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.success ? response.data : {},
    }),
    addAdministrativeExpense: builder.mutation({
      query: (newExpense) => ({
        url: '/',
        method: 'POST',
        body: newExpense,
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['AdministrativeExpense'],
    }),
    updateAdministrativeExpense: builder.mutation({
      query: (updatedExpense) => ({
        url: `/${updatedExpense.id}`,
        method: 'PUT',
        body: updatedExpense,
      }),
      transformResponse: (response) => response.success ? response.data : {},
      invalidatesTags: ['AdministrativeExpense'],
    }),
    deleteAdministrativeExpense: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
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
} = administrativeExpensesApi;