# redux-global-state-hooks

Create hooks that work similar to `useState` but which are backed with Redux and don't need `Context`.

Use this for simple pieces of local data spread across components. For data that needs to be fetched over the network you can use `react-query` or similar.

## tl;dr

Use `createGlobalStateHook` in, say, `useCounter.js`.

Use `createGlobalStateReducer` to create a reducer and set the initial value in your `store.js` file.

Use `useCounter` as `const [counter, setCounter] = useCounter();` in your component.

It's just like a React hook but it's backed by Redux.

## Give me an example

`ComponentOne.js:`

```
import React from 'react';
import useCounter from './useCounter';

const ComponentOne = () => {
  const [counter, setCounter] = useCounter(); // Same counter data as ComponentTwo
  return (
    <>
      <h3>Component One</h3>
      <div>Count is {count}</div>
      <button onclick={() => setCounter(count + 1)}>Increment</button>
    </>
  )
}

export default ComponentOne;
```

`ComponentTwo.js:`

```
import React from 'react';
import useCounter from './useCounter';

const ComponentTwo = () => {
  const [counter, setCounter] = useCounter(); // Same counter data as ComponentOne
  return (
    <>
      <h3>Component Two</h3>
      <div>Count is {count}</div>
      <button onclick={() => setCounter(count - 1)}>Decrement</button>
    </>
  )
}

export default ComponentTwo;
```

`store.js`:

```
import { configureStore } from '@reduxjs/toolkit';
import { createGlobalStateReducer } from '@folkforms/redux-global-state-hooks';

export default configureStore({
  reducer: {
    // Arguments are the namespace and initial value
    counter: createGlobalStateReducer('counter', 1),
  }
});
```

`useCounter.js`:

```
import { createGlobalStateHook } from '@folkforms/redux-global-state-hooks';

const counter = createGlobalStateHook('counter'); // Argument is the namespace
export default counter;
```

## y tho?

It makes handling simple pieces of data easier.

Compare `foo` vs `const foo = useSelector(selectFoo);` to get data.

Compare `setFoo(1)` vs `const dispatch = useDispatch(); dispatch(updateFoo(1));` to update data.

- It saves you from the boilerplate of `useSelector` and `useDispatch`
- It allows you to create a Redux store slice automatically
- It is very similar to `useState` in its use

## Why do I set the initial value in `store.js`?

We need a single place to set the initial value. Otherwise one component could say `... = useCounter(1)` and another `... = useCounter(2)`, and then which one is correct?
