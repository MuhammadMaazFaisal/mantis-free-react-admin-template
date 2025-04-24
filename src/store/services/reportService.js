import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const reportService = createApi({
  reducerPath: 'reportService',
  baseQuery: commonBaseQuery(''),
  endpoints: (builder) => ({
    getStockReport: builder.query({
      query: (warehouseId) => ({
        url: `/reports/stock-report`,
        params: { warehouse_id: warehouseId }
      }),

      transformResponse: (response) => (response.success ? response.data : {})
    }),
    getTrialBalanceReport: builder.query({
      query: () => '/reports/trial-balance',

      transformResponse: (response) => (response.success ? response.data : {})
    }),
    getReceivableReport: builder.query({
      query: () => '/reports/receivable-report',
      transformResponse: (response) => (response.success ? response.data : {})
    }),
    getPartyLedger: builder.query({
      query: ({ fromDate, toDate, account_id }) => ({
        url: '/reports/party-ledger',
        params: { fromDate, toDate, account_id }
      }),
    }),
    getLotLedger: builder.query({
      query: (lotNumber) => ({
        url: '/reports/lot-ledger',
        params: { lotNumber }
      }),
    })
  })
});

export const {
  useGetStockReportQuery,
  useGetTrialBalanceReportQuery,
  useGetReceivableReportQuery,
  useGetPartyLedgerQuery,
  useGetLotLedgerQuery
} = reportService;
