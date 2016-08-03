/**
 * Created by Daniel on 8/2/2016.
 */
"use strict";

import React from "react";

const Login = React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState() {
    return {
      email: "",
      password: ""
    };
  },

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    });
  },

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    });
  },

  login() {
    this.context.router.push("/track");
  },

  render() {
    return <div>
      <form className="form-horizontal">
        <div className="form-group">
          <label htmlFor="email" className="col-sm-2 control-label">Email</label>
          <div className="col-sm-10">
              <input type="email" className="form-control" id="email"
                     value={this.state.email}
                     onChange={this.handleEmailChange}/>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="col-sm-2 control-label">Password</label>
          <div className="col-sm-10">
            <input type="password" className="form-control" id="password"
                   value={this.state.password}
                   onChange={this.handlePasswordChange}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button className="btn btn-md btn-default" onClick={this.login}>
              Login
            </button>
          </div>
        </div>
      </form>
    </div>;
  }
});

export default Login;