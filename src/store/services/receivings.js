import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const receivingsApi = createApi({
  reducerPath: 'receivingsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Receiving'],
  endpoints: (builder) => ({
    getReceivings: builder.query({
      queryFn: () => ({
        data: [
          {
            id: 352,
            lotNumber: 3005,
            arrivalDate: '2025-04-09',
            party: 'SA Rice',
            receivingType: 'Milling',
            fileNumber: '',
            remarks: '',
            total: 0.0,
            discountPercent: 0.0,
            grandTotal: 0.0,
            active: true,
            details: [
              {
                location: 'SA Godown',
                product: '1121 Sella Raw',
                unit: 'Kg',
                qty: 1200,
                rate: 0.0,
                amount: 0.0,
                weight: 60290.0,
                invRate: 0.0,
                fortyKgRate: 0.0,
                vehicleNo: '',
              },
            ],
          },
          {
            id: 349,
            lotNumber: 3004,
            arrivalDate: '2025-03-27',
            party: 'SA Rice',
            receivingType: 'Milling',
            fileNumber: '',
            remarks: '',
            total: 0.0,
            discountPercent: 0.0,
            grandTotal: 0.0,
            active: true,
            details: [],
          },
        ],
      }),
      providesTags: ['Receiving'],
    }),
    getReceivingById: builder.query({
      queryFn: (id) => ({
        data: {
          id,
          lotNumber: 3005,
          arrivalDate: '2025-04-09',
          party: 'SA Rice',
          receivingType: 'Milling',
          fileNumber: '',
          remarks: '',
          total: 0.0,
          discountPercent: 0.0,
          grandTotal: 0.0,
          active: true,
          lastInvoiceDate: '2025-04-09',
          nextInvoiceDate: '2025-05-09',
          addedBy: 'Admin',
          addedOn: '2025-04-09 14:35:37',
          modifiedBy: '',
          modifiedOn: '',
          status: 'Pending',
          details: [
            {
              location: 'SA Godown',
              product: '1121 Sella Raw',
              unit: 'Kg',
              qty: 1200,
              rate: 0.0,
              amount: 0.0,
              weight: 60290.0,
              invRate: 0.0,
              fortyKgRate: 0.0,
              vehicleNo: '',
            },
          ],
        },
      }),
      providesTags: ['Receiving'],
    }),
    addReceiving: builder.mutation({
      queryFn: (newReceiving) => ({ data: { ...newReceiving, id: Math.random() } }),
      invalidatesTags: ['Receiving'],
    }),
    updateReceiving: builder.mutation({
      queryFn: (updatedReceiving) => ({ data: updatedReceiving }),
      invalidatesTags: ['Receiving'],
    }),
  }),
});

export const {
  useGetReceivingsQuery,
  useGetReceivingByIdQuery,
  useAddReceivingMutation,
  useUpdateReceivingMutation,
} = receivingsApi;