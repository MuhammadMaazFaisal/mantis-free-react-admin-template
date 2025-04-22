import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const processingPaymentApi = createApi({
	reducerPath: 'processingPaymentApi',
	baseQuery: commonBaseQuery(''),
	tagTypes: ['ProcessingPayment'],
	endpoints: (builder) => ({
		getProcessingPayments: builder.query({
			query: () => 'processing-payments',
			transformResponse: (response) => response.success ? response.data : [],
			providesTags: ['ProcessingPayment'],
		}),
		getProcessingPaymentById: builder.query({
			query: (id) => `processing-payments/${id}`,
			transformResponse: (response) => response.success ? response.data : {},
		}),
		addProcessingPayment: builder.mutation({
			query: (newPayment) => ({
				url: 'processing-payments',
				method: 'POST',
				body: newPayment,
			}),
			transformResponse: (response) => response.success ? response.data : {},
			invalidatesTags: ['ProcessingPayment'],
		}),
		updateProcessingPayment: builder.mutation({
			query: (updatedPayment) => ({
				url: `processing-payments/${updatedPayment.id}`,
				method: 'PUT',
				body: updatedPayment,
			}),
			transformResponse: (response) => response.success ? response.data : {},
			invalidatesTags: ['ProcessingPayment'],
		}),
		deleteProcessingPayment: builder.mutation({
			query: (id) => ({
				url: `processing-payments/${id}`,
				method: 'DELETE',
			}),
			transformResponse: (response) => response.success ? response.data : {},
			invalidatesTags: ['ProcessingPayment'],
		}),
	}),
});

export const { 
	useGetProcessingPaymentsQuery,
	useGetProcessingPaymentByIdQuery,
	useAddProcessingPaymentMutation,
	useUpdateProcessingPaymentMutation,
	useDeleteProcessingPaymentMutation 
} = processingPaymentApi;
