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
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "./main.css";

import {Router, Route, hashHistory, IndexRoute} from "react-router";

render(<Router history={hashHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={Login}/>
    <Route path="/login" component={Login} />
    <Route path="/track" component={Track}/>
    <Route path="/configure" component={Configure}/>
  </Route>
</Router>, document.getElementById("root"));
