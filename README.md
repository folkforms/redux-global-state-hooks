# redux-global-state-hook

Create hooks that work similar to `useState` but which are backed with Redux and don't need `Context`.

You want to use this for simple pieces of local data spread across components, not for data that needs to be fetched over the network. For the latter you can use `react-query` or similar.

## tl;dr

Use `createGlobalStateReducer` to create a reducer and set the initial value in your `store.js` file.

Use `createGlobalStateHook` in, say, `useCounter.js`.

Use `useCounter` as `const [counter, setCounter] = useCounter();` in your component.

## Give me an example

`ComponentOne.js:`

```
import React from 'react';
import useCounter from './useCounter';

const ComponentOne = () => {
  const [counter, setCounter] = useCounter();
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
  const [counter, setCounter] = useCounter();
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

Both of the above components are tied to a Redux store slice called 'counter'.

`store.js`:

```
import { configureStore } from '@reduxjs/toolkit';
import { createGlobalStateReducer } from '@folkforms/redux-global-state-hook';

export default configureStore({
  reducer: {
    counter: createGlobalStateReducer('counter', 1),
  }
});
```

`useCounter.js`:

```
import { createGlobalStateHook } from '@folkforms/redux-global-state-hook';

const counter = createGlobalStateHook('counter');
export default counter;
```

## y tho?

It saves you from the boilerplate of use `useSelector` and `useDispatch` when you are handling simple pieces of local data.

## Why do I set the initial value in `store.js`?

Because we want a single source of truth for the initial value. Otherwise one component could say `... = useCounter(1)` and another `... = useCounter(2)`, and then which one is correct?
