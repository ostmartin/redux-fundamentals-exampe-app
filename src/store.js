import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";

import filtersReducer from "./features/filters/filtersSlice";
import todosReducer from "./features/todos/todosSlice";

// const composedEnhancers = composeWithDevTools(
//   applyMiddleware(thunkMiddleware)
// );

// const store = createStore(rootReducer,composedEnhancers);

const store = configureStore({
  reducer: {
    todos: todosReducer,
    filters: filtersReducer
  }
})

export default store;