import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: commonBaseQuery(''),
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    productGroups: builder.query({
      query: () => '/product-groups',
      transformResponse: (response) => response.success ? response.data : [],
    }),
    getProductGroupById: builder.query({
      query: (id) => `/product-groups/${id}`,
      transformResponse: (response) => response.success ? response.data : [],
    }),
    addProductGroup: builder.mutation({
      query: (newPG) => ({
        url: '/product-groups',
        method: 'POST',
        body: newPG,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    updateProductGroup: builder.mutation({
      query: (updatedPG) => ({
        url: `/product-groups/${updatedPG.id}`,
        method: 'PUT',
        body: updatedPG,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    deleteProductGroup: builder.mutation({
      query: (id) => ({
        url: `/product-groups/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    chartsOfAccounts: builder.query({
      query: () => '/charts-of-accounts',
      transformResponse: (response) => response.success ? response.data : [],
    }),
    getChartOfAccountById: builder.query({
      query: (id) => `/charts-of-accounts/${id}`,
      transformResponse: (response) => response.success ? response.data : [],
    }),
    addChartOfAccount: builder.mutation({
      query: (newAcc) => ({
        url: '/charts-of-accounts',
        method: 'POST',
        body: newAcc,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    updateChartOfAccount: builder.mutation({
      query: (updatedAcc) => ({
        url: `/charts-of-accounts/${updatedAcc.id}`,
        method: 'PUT',
        body: updatedAcc,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    deleteChartOfAccount: builder.mutation({
      query: (id) => ({
        url: `/charts-of-accounts/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    locations: builder.query({
      query: () => '/locations',
      transformResponse: (response) => response.success ? response.data : [],
    }),
    getLocationById: builder.query({
      query: (id) => `/locations/${id}`,
      transformResponse: (response) => response.success ? response.data : [],
    }),
    addLocation: builder.mutation({
      query: (newLocation) => ({
        url: '/locations',
        method: 'POST',
        body: newLocation,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    updateLocation: builder.mutation({
      query: (updatedLocation) => ({
        url: `/locations/${updatedLocation.id}`,
        method: 'PUT',
        body: updatedLocation,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    deleteLocation: builder.mutation({
      query: (id) => ({
        url: `/locations/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    warehouses: builder.query({
      query: () => '/warehouses',
      transformResponse: (response) => response.success ? response.data : [],
    }),
    getWarehouseById: builder.query({
      query: (id) => `/warehouses/${id}`,
      transformResponse: (response) => response.success ? response.data : [],
    }),
    addWarehouse: builder.mutation({
      query: (newWarehouse) => ({
        url: '/warehouses',
        method: 'POST',
        body: newWarehouse,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    updateWarehouse: builder.mutation({
      query: (updatedWarehouse) => ({
        url: `/warehouses/${updatedWarehouse.id}`,
        method: 'PUT',
        body: updatedWarehouse,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    deleteWarehouse: builder.mutation({
      query: (id) => ({
        url: `/warehouses/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    units: builder.query({
      query: () => '/units',
      transformResponse: (response) => response.success ? response.data : [],
    }),
    getUnitById: builder.query({
      query: (id) => `/units/${id}`,
      transformResponse: (response) => response.success ? response.data : [],
    }),
    addUnit: builder.mutation({
      query: (newUnit) => ({
        url: '/units',
        method: 'POST',
        body: newUnit,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    updateUnit: builder.mutation({
      query: (updatedUnit) => ({
        url: `/units/${updatedUnit.id}`,
        method: 'PUT',
        body: updatedUnit,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({
        url: `/units/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    config: builder.query({
      query: () => '/config',
      transformResponse: (response) => response.success ? response.data : [],
    }),
    updateConfig: builder.mutation({
      query: (updatedConfig) => ({
        url: `/config/${updatedConfig.id}`,
        method: 'PUT',
        body: updatedConfig,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    storeConfig: builder.mutation({
      query: (newConfig) => ({
        url: '/config',
        method: 'POST',
        body: newConfig,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    expenseTypes: builder.query({
      query: () => '/expense-types',
      transformResponse: (response) => response.success ? response.data : [],
    }),
    getExpenseTypeById: builder.query({
      query: (id) => `/expense-types/${id}`,
      transformResponse: (response) => response.success ? response.data : [],
    }),
    addExpenseType: builder.mutation({
      query: (newType) => ({
        url: '/expense-types',
        method: 'POST',
        body: newType,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    updateExpenseType: builder.mutation({
      query: (updatedType) => ({
        url: `/expense-types/${updatedType.id}`,
        method: 'PUT',
        body: updatedType,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    deleteExpenseType: builder.mutation({
      query: (id) => ({
        url: `/expense-types/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    chargesTypes: builder.query({
      query: () => '/charges-types',
      transformResponse: (response) => response.success ? response.data : [],
    }),
    getChargeTypeById: builder.query({
      query: (id) => `/charges-types/${id}`,
      transformResponse: (response) => response.success ? response.data : [],
    }),
    addChargeType: builder.mutation({
      query: (newCharge) => ({
        url: '/charges-types',
        method: 'POST',
        body: newCharge,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    updateChargeType: builder.mutation({
      query: (updatedCharge) => ({
        url: `/charges-types/${updatedCharge.id}`,
        method: 'PUT',
        body: updatedCharge,
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
    deleteChargeType: builder.mutation({
      query: (id) => ({
        url: `/charges-types/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.success ? response.data : [],
    }),
  }),
});

export const { 
  useProductGroupsQuery, useGetProductGroupByIdQuery, useAddProductGroupMutation, useUpdateProductGroupMutation, useDeleteProductGroupMutation,
  useChartsOfAccountsQuery, useGetChartOfAccountByIdQuery, useAddChartOfAccountMutation, useUpdateChartOfAccountMutation, useDeleteChartOfAccountMutation,
  useLocationsQuery, useGetLocationByIdQuery, useAddLocationMutation, useUpdateLocationMutation, useDeleteLocationMutation,
  useWarehousesQuery, useGetWarehouseByIdQuery, useAddWarehouseMutation, useUpdateWarehouseMutation, useDeleteWarehouseMutation,
  useUnitsQuery, useGetUnitByIdQuery, useAddUnitMutation, useUpdateUnitMutation, useDeleteUnitMutation,
  useConfigQuery, useUpdateConfigMutation, useStoreConfigMutation,
  useExpenseTypesQuery, useGetExpenseTypeByIdQuery, useAddExpenseTypeMutation, useUpdateExpenseTypeMutation, useDeleteExpenseTypeMutation,
  useChargesTypesQuery, useGetChargeTypeByIdQuery, useAddChargeTypeMutation, useUpdateChargeTypeMutation, useDeleteChargeTypeMutation
} = settingsApi;
