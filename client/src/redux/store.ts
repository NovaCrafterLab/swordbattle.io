// client/src/redux/store.ts
// configure and export store and types

import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './account/slice';
// ... other imports

export const store = configureStore({
  reducer: {
    account: accountReducer,
    // ... other reducers
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
