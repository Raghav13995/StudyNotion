import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
// tu use toaster in our app
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { HashRouter } from "react-router-dom";

const store=configureStore({
  reducer:rootReducer,
})
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // npm i react-router-dom is used to route in react
  
  <React.StrictMode>
    <Provider store = {store}>
        <HashRouter>
          <App /> 
          <Toaster />
        </HashRouter>  
    </Provider>
  </React.StrictMode>

);
