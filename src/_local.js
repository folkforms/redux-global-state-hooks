import { useDispatch, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit'

const _create = (name, initialValue) => {
  const slice = createSlice({
    name,
    initialState: { data: initialValue },
    reducers: {
      set: (state, action) => {
        state.data = action.payload;
      }
    }
  });

  const selector = state => state[name].data;

  const useX = () => {
    const value = useSelector(selector);
    const dispatch = useDispatch();
    const { set } = slice.actions;
    const setValue = newValue => dispatch(set(newValue));
    return [value, setValue];
  }

  return {
    reducer: slice.reducer,
    hook: useX,
  }
}

const createReducer = (namespace, initialValue) => {
  return _create(namespace, initialValue).reducer;
}

const createHook = namespace => {
  return _create(namespace).hook;
}

export { createReducer, createHook };
