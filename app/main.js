/**
 * Created by Daniel on 7/26/2016.
 */
"use strict";
import React from "react";
import {render} from "react-dom";
import App from "./components/App";
import Track from "./components/Track";
import Login from "./components/Login";
import Configure from "./components/Configure";
import Signup from "./components/Signup";
import SuccessfulSignup from "./components/SuccessfulSignup";
import OnlineReport from "./components/OnlineReport";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Support from "./components/Support";
import {Provider} from "react-redux";
import {createStore} from "redux";
import trackerStore from "./reducers";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "font-awesome/css/font-awesome.css";
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
                    <Route path="report" component={OnlineReport} />
                </Route>
                <Route path="signup" component={Signup}/>
                <Route path="successSignup" components={SuccessfulSignup} />
                <Route path="privacy" component={PrivacyPolicy}/>
                <Route path="support" component={Support}/>
            </Route>
        </Router>
    </Provider>, document.getElementById("root"));
