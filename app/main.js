/**
 * Created by Daniel on 7/26/2016.
 */
"use strict";
import React from "react";
import {render} from "react-dom";
import App from "./App";
import Track from "./Track";
import Configure from "./Configure";

import {Router, Route, browserHistory, IndexRoute} from "react-router";

render(<Router history={browserHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={Configure}/>
    <Route path="/track" component={Track}/>
    <Route path="/configure" component="Configure"/>
  </Route>
</Router>, document.getElementById("root"));