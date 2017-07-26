/**
 * Created by Daniel on 7/26/2016.
 */
import * as React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Link, Redirect, Route } from "react-router-dom";
import Configure from "./Configure";
import { ConnectedState, mapStateToProps } from "./ConnectedState";
import { Home } from "./Home";
import Login from "./Login";
import OnlineReport from "./OnlineReport";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { PrivateRoute } from "./PrivateRoute";
import { Signup } from "./Signup";
import { SuccessfulSignup } from "./SuccessfulSignup";
import { Support } from "./Support";
import Track from "./Track";

class App extends React.Component<ConnectedState & any & any, any> {

    render() {
        const { authenticated } = this.props.data;
        console.log("Am I authenticated?", authenticated);
        return (
            <BrowserRouter>
                <div className="theme-showcase container">
                    <nav className="navbar navbar-default"
                        role="navigation">
                        <div>
                            <div className="navbar-brand"><Link to="/">Toilet Training Tracker</Link></div>
                            <div className="navbar-icons" hidden={!authenticated}>
                                <Link to="/track">
                                    <i className="fa fa-road" title="Track" />
                                </Link>
                                <Link to="/report">
                                    <i className="fa fa-flag" title="Report" />
                                </Link>
                                <Link to="/configure">
                                    <i className="fa fa-cog" title="Configure" />
                                </Link>
                                <Link to="/login">
                                    <i className="fa fa-sign-out" title="Logout" />
                                </Link>
                            </div>
                        </div>
                    </nav>
                    <div>
                        <Route exact={true} path="/" component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={Signup} />
                        <Route path="/successSignup" component={SuccessfulSignup} />
                        <Route path="/privacy" component={PrivacyPolicy} />
                        <Route path="/support" component={Support} />
                        <PrivateRoute path="/track" isAuthenticated={authenticated} component={Track} />
                        <PrivateRoute path="/configure" isAuthenticated={authenticated} component={Configure} />
                        <PrivateRoute path="/report" isAuthenticated={authenticated} component={OnlineReport} />
                        <hr />
                        <footer>
                            <p>&copy; 2017 halversondm.com - <Link to="/privacy">Privacy Policy</Link> - <Link
                                to="/support">Support</Link></p>
                        </footer>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default connect(mapStateToProps)(App);
