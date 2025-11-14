import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "../slice/clientSlice"

 const store = configureStore({
  reducer: {
 
    client: clientReducer,
  },
 
});

export default store