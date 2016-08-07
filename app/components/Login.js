/**
 * Created by Daniel on 8/2/2016.
 */
"use strict";

import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {updateForm, authenticated, notAuthenticated, setConfig} from "../actions";

const Login = withRouter(React.createClass({

    propTypes: {
        dispatch: React.PropTypes.func,
        router: React.PropTypes.object
    },

    getInitialState() {
        return {
            email: "",
            key: ""
        };
    },

    handleEmailChange(event) {
        this.setState({
            email: event.target.value,
            error: false
        });
    },

    handlePasswordChange(event) {
        this.setState({
            key: event.target.value,
            error: false
        });
    },

    login(event) {
        event.preventDefault();
        this.props.dispatch(updateForm(this.state.email, this.state.key));
        var data = JSON.stringify(this.state);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/loginService");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                const response = JSON.parse(xhr.responseText);
                this.props.dispatch(authenticated());
                this.props.dispatch(setConfig(response.config, response.profileId));
                this.props.router.replace("/track");
            } else {
                console.log("unsucc ", xhr.responseText);
                this.props.dispatch(notAuthenticated());
                this.setState({error: true});
            }
        };
        xhr.onerror = () => {
            console.log(xhr);
        };
        xhr.send(data);
    },

    render() {
        return <div>
            <div className="alert alert-danger alert-dismissible" role="alert"
                 hidden={!this.state.error}>
                <button type="button" className="close" data-dismiss="alert"><span
                    aria-hidden="true">&times;</span></button>
                <strong>Error! </strong>
                Email or Password are invalid.
            </div>
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="email"
                           className="col-sm-2 control-label">Email</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" id="email"
                               value={this.state.email}
                               onChange={this.handleEmailChange}/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password"
                           className="col-sm-2 control-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="password"
                               value={this.state.key}
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
}));

function select(state) {
    return {
        data: state
    };
}

export default connect(select)(Login);
