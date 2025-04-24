import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { partyApi } from './services/party';
import { productApi } from './services/product';
import { receivingsApi } from './services/receivings';
import { processingApi } from './services/processing';
import { authApi } from './services/auth';
import authReducer from './slices/authSlice';
import { processingPaymentApi } from './services/processingPayment';
import { adminExpensesApi } from './services/adminExpenses';
import { settingsApi } from './services/settings';
import { reportsApi } from './services/reports';
import { userApi } from './services/user';
import { dashboardApi } from './services/dashboard';
import { reportService } from './services/reportService';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [partyApi.reducerPath]: partyApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [receivingsApi.reducerPath]: receivingsApi.reducer,
    [processingApi.reducerPath]: processingApi.reducer,
    [processingPaymentApi.reducerPath]: processingPaymentApi.reducer,
    [adminExpensesApi.reducerPath]: adminExpensesApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [reportService.reducerPath]: reportService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      partyApi.middleware,
      productApi.middleware,
      receivingsApi.middleware,
      processingApi.middleware,
      processingPaymentApi.middleware,
      adminExpensesApi.middleware,
      settingsApi.middleware,
      reportsApi.middleware,
      userApi.middleware,
      dashboardApi.middleware,
      reportService.middleware,
    ]),
});
setupListeners(store.dispatch);
export default store;