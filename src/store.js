import { composeWithDevTools } from "redux-devtools-extension";

import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducer";

const composedEnhancers = composeWithDevTools(
  applyMiddleware(thunkMiddleware)
);

const store = createStore(rootReducer,composedEnhancers);

export default store;