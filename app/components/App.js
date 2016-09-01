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
            <div className="container">
                <nav className="navbar navbar-default"
                     role="navigation">
                    <div>
                        <div className="navbar-brand">Toilet Training Tracker</div>
                        <div className="navbar-icons" hidden={!authenticated}>
                            <Link to="/configure">
                                <i className="glyphicon glyphicon-cog"/>
                            </Link>
                            <Link to="/track">
                                <i className="glyphicon glyphicon-road"/>
                            </Link>
                        </div>
                    </div>
                </nav>
                <div className="theme-showcase container">
                    {this.props.children || <Link to="login">Please login.</Link>}
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
