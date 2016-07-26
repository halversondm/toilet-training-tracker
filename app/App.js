/**
 * Created by Daniel on 7/26/2016.
 */
"use strict";

import React from "react";
import {Link} from "react-router";

const App = React.createClass({
  propTypes: {
    children: React.PropTypes.object
  },

  render() {
    return (
      <div>
        <div className="header">
          <div className="navbar navbar-default navbar-fixed-top" role="navigation">
            <div className="container">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target="#js-navbar-collapse">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                </button>
                <div className="navbar-brand">Toilet Training Tracker</div>
              </div>
              <div className="collapse navbar-collapse" id="js-navbar-collapse">
                <ul className="nav navbar-nav">
                  <li><Link to="/track">Track</Link></li>
                  <li><Link to="/config">Configure</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="theme-showcase container">
          {this.props.children}
          <hr />
          <footer>
            <p>&copy; 2016 halversondm.com</p>
          </footer>
        </div>
      </div>);
  }
});

export default App;