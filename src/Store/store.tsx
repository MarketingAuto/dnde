import { configureStore } from '@reduxjs/toolkit';
import { FC, PropsWithChildren } from 'react';
import { ConeApi } from '../Api/api';
import { templateListReducer } from './list';

import { Provider } from 'react-redux';

const store = configureStore({
  reducer: { [ConeApi.reducerPath]: ConeApi.reducer, templateList: templateListReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ConeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const StoreProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
