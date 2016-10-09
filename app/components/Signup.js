/**
 * Created by halversondm on 9/9/16.
 */
"use strict";

import React, {Component} from "react";
import {withRouter} from "react-router";

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {name: "", email: "", key: "", keyRetype: ""};
        this.signup = this.signup.bind(this);
    }

    signup(event) {
        event.preventDefault();
        if (this.state.key !== this.state.keyRetype) {
            return;
        }
        var data = JSON.stringify(this.state);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/signup");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                this.props.router.replace("/successSignup");
            } else {
                console.log("unsucc ", xhr.responseText);
            }
        };
        xhr.onerror = () => {
            console.log(xhr);
        };
        xhr.send(data);
    }

    render() {
        return (
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="name"
                           className="col-sm-2 control-label">Name</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="name"
                               value={this.state.name}
                               onChange={event => {
                                   this.setState({
                                       name: event.target.value
                                   });
                               }}/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="email"
                           className="col-sm-2 control-label">Email Address</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" id="email"
                               value={this.state.email}
                               onChange={event => {
                                   this.setState({
                                       email: event.target.value
                                   });
                               }}/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password"
                           className="col-sm-2 control-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="password"
                               value={this.state.key}
                               onChange={event => {
                                   this.setState({
                                       key: event.target.value
                                   });
                               }}/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password"
                           className="col-sm-2 control-label">Re-type Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="password"
                               value={this.state.keyRetype}
                               onChange={event => {
                                   this.setState({
                                       keyRetype: event.target.value
                                   });
                               }}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <button className="btn btn-primary" onClick={this.signup}>
                            Save
                        </button>
                    </div>
                </div>
            </form>);
    }
}

Signup.propTypes = {
    router: React.PropTypes.object
};

export default withRouter(Signup);
