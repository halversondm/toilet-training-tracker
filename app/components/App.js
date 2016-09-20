/**
 * Created by Daniel on 7/26/2016.
 */
"use strict";

import React, {Component} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

class App extends Component {

    render() {
        const {authenticated} = this.props.data;
        return (
            <div className="theme-showcase container">
                <nav className="navbar navbar-default"
                     role="navigation">
                    <div>
                        <div className="navbar-brand">Toilet Training Tracker</div>
                        <div className="navbar-icons" hidden={!authenticated}>
                            <Link to="/report">
                                <i className="fa fa-flag" title="Report" />
                            </Link>
                            <Link to="/configure">
                                <i className="fa fa-cog" title="Configure"/>
                            </Link>
                            <Link to="/track">
                                <i className="fa fa-road" title="Track"/>
                            </Link>
                            <Link to="/login">
                                <i className="fa fa-sign-out" title="Logout" />
                            </Link>
                        </div>
                    </div>
                </nav>
                <div>
                    {this.props.children ||
                    <div><Link to="login">Please login</Link> or <Link to="signup">Sign-up</Link></div>}
                    <hr />
                    <footer>
                        <p>&copy; 2016 halversondm.com</p>
                    </footer>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.object,
    data: React.PropTypes.object
};

App.contextTypes = {
    router: React.PropTypes.object
};

function select(state) {
    return {
        data: state
    };
}

export default connect(select)(App);
