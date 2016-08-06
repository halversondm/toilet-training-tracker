/**
 * Created by Daniel on 7/26/2016.
 */
"use strict";

import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

const App = React.createClass({
  propTypes: {
    children: React.PropTypes.object,
    data: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.object
  },

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
          {this.props.children}
          <hr />
          <footer>
            <p>&copy; 2016 halversondm.com</p>
          </footer>
        </div>
      </div>
    );
  }
});

function select(state) {
  return {
    data: state
  };
}

export default connect(select)(App);
