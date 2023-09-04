import { useEffect } from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';
import * as ApiStatus from './api-status';

const _create = (name, initialValue, fetchMethod) => {
  const fetchMethodInternal = createAsyncThunk(`${name}/fetch-${name}`, async () => await fetchMethod());

  const slice = createSlice({
    name: name,
    initialState: {
      data: initialValue,
      status: ApiStatus.IDLE,
      error: null
    },
    reducers: {},
    extraReducers(builder) {
      builder
        .addCase(fetchMethodInternal.pending, (state, action) => {
          state.status = ApiStatus.LOADING;
        })
        .addCase(fetchMethodInternal.fulfilled, (state, action) => {
          state.status = ApiStatus.SUCCEEDED;
          state.data = action.payload;
        })
        .addCase(fetchMethodInternal.rejected, (state, action) => {
          state.status = ApiStatus.FAILED;
          state.error = action.error.message;
        })
    }
  });

  const selectData = state => state[name].data;
  const selectStatus = state => state[name].status;
  const selectError = state => state[name].error;

  const useX = () => {
    const data = useSelector(selectData);
    const status = useSelector(selectStatus);
    const error = useSelector(selectError);

    const dispatch = useDispatch();
    const useFetch = () =>
      useEffect(() => {
        dispatch(fetchMethodInternal());
      }, []);

    return [{ data, status, error }, useFetch];
  }

  return {
    reducer: slice.reducer,
    hook: useX,
  }
}

const createNetworkReducer = (namespace, initialValue) => {
  return _create(namespace, initialValue, undefined).reducer;
}

const createNetworkHook = (namespace, fetchMethod) => {
  return _create(namespace, undefined, fetchMethod).hook;
}

export { createNetworkReducer, createNetworkHook };
