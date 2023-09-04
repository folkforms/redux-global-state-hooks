# redux-global-state-hooks

Create hooks that work similar to `useState` but which are backed with Redux and don't need `Context`.

Use this for simple pieces of local data spread across components. For data that needs to be fetched over the network you can use `react-query` or similar.

I assume you are using [Redux Toolkit](https://redux-toolkit.js.org/) since it is now the official standard approach for writing Redux logic. It won't work with old Redux.

## tl;dr

`import { createHook, createReducer } from @folkforms/react-global-state-hooks;`

Use `createHook` in, say, `useCounter.js`.

Use `createReducer` in your `store.js` file to create a reducer and set the initial value.

Use `useCounter` as `const [counter, setCounter] = useCounter();` in your component.

It's just like a React hook but it's backed by Redux.

## Give me an example

`ComponentOne.js`:

```
import React from 'react';
import useCounter from './useCounter';

const ComponentOne = () => {
  // Uses the same counter data in Redux store as ComponentTwo
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

`ComponentTwo.js`:

```
import React from 'react';
import useCounter from './useCounter';

const ComponentTwo = () => {
  // Uses the same counter data in Redux store as ComponentOne
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

`store.js`:

```
import { configureStore } from '@reduxjs/toolkit';
import { createReducer } from '@folkforms/redux-global-state-hooks';

export default configureStore({
  reducer: {
    // Arguments are the namespace and the initial value
    counter: createReducer('counter', 1),
  }
});
```

`useCounter.js`:

```
import { createHook } from '@folkforms/redux-global-state-hooks';

// Argument is the namespace
const useCounter = createHook('counter');
export default useCounter;
```

## y tho?

It makes handling simple pieces of data easier.

Compare the above code to creating a dedicated Redux store slice, and using `useSelector` and `useDispatch`. The above code is much shorter.

It allows you to create a Redux store slice automatically.

It is very similar to `useState` in its use but it's global, not local.

I love `useState` but I find that when my apps get above a certain size then `useContext` breaks down and I either start building my own version of Redux (bad) or using Redux itself. Redux is great, but it does tend to make something simple like storing a piece of data quite tedious and full of boilerplate. This library is designed to alleviate that problem while still being compatible with Redux.

## Why do I set the initial value in `store.js`?

We need a single place to set the initial value. Otherwise one component could say `... = useCounter(1)` and another `... = useCounter(2)`, and then which one is correct?
