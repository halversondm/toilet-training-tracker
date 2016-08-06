/**
 * Created by Daniel on 7/26/2016.
 */
"use strict";
import React from "react";
import {render} from "react-dom";
import App from "./App";
import Track from "./Track";
import Login from "./Login";
import Configure from "./Configure";
import {Provider} from "react-redux";
import {createStore} from "redux";
import trackerStore from "./reducers";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "./main.css";

import {Router, Route, hashHistory, IndexRoute} from "react-router";

let store = createStore(trackerStore);

function checkAuth(nextState, replaceState) {
  const {authenticated} = store.getState();

  if (!authenticated) {
    replaceState(null, "/login");
  }
}

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Login}/>
        <Route path="/login" component={Login}/>
        <Route path="/track" component={Track} onEnter={checkAuth}/>
        <Route path="/configure" component={Configure} onEnter={checkAuth}/>
      </Route>
    </Router>
  </Provider>, document.getElementById("root"));
