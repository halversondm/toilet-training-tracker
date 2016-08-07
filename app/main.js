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
import {Router, Route, browserHistory} from "react-router";

let store = createStore(trackerStore);

function checkAuth(nextState, replace) {
    const {authenticated} = store.getState();
    if (!authenticated) {
        replace({pathname: "/login", state: {nextPathname: nextState.location.pathname}});
    }
}

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <Route path="login" component={Login}/>
                <Route onEnter={checkAuth}>
                    <Route path="track" component={Track}/>
                    <Route path="configure" component={Configure}/>
                </Route>
            </Route>
        </Router>
    </Provider>, document.getElementById("root"));
