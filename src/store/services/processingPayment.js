import { createApi } from '@reduxjs/toolkit/query/react';
import { commonBaseQuery } from './baseApi';

export const processingPaymentApi = createApi({
	reducerPath: 'processingPaymentApi',
	baseQuery: commonBaseQuery('processing-payments'),
	tagTypes: ['ProcessingPayment'],
	endpoints: (builder) => ({
		getProcessingPayments: builder.query({
			query: () => '/',
			transformResponse: (response) => response.success ? response.data : [],
			providesTags: ['ProcessingPayment'],
		}),
		getProcessingPaymentById: builder.query({
			query: (id) => `/${id}`,
			transformResponse: (response) => response.success ? response.data : {},
		}),
		addProcessingPayment: builder.mutation({
			query: (newPayment) => ({
				url: '/',
				method: 'POST',
				body: newPayment,
			}),
			transformResponse: (response) => response.success ? response.data : {},
			invalidatesTags: ['ProcessingPayment'],
		}),
		updateProcessingPayment: builder.mutation({
			query: (updatedPayment) => ({
				url: `/${updatedPayment.id}`,
				method: 'PUT',
				body: updatedPayment,
			}),
			transformResponse: (response) => response.success ? response.data : {},
			invalidatesTags: ['ProcessingPayment'],
		}),
		deleteProcessingPayment: builder.mutation({
			query: (id) => ({
				url: `/${id}`,
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
