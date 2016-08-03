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
      <div className="container">
        <nav className="navbar navbar-default"
             role="navigation">
          <div>
            <div className="navbar-brand">Toilet Training Tracker</div>
            <div className="navbar-icons">
              <Link to="/configure">
                <i className="fa fa-cog fa-lg"/>
              </Link>
              <Link to="/track">
                <i className="fa fa-recycle fa-lg"/>
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

export default App;
