/**
 * Created by Daniel on 8/2/2016.
 */
"use strict";

import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {updateForm, authenticated, notAuthenticated, setConfig} from "../actions";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            key: ""
        };
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(notAuthenticated());
    }

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
    }

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
                               onChange={event => {
                                   this.setState({
                                       email: event.target.value,
                                       error: false
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
                                       key: event.target.value,
                                       error: false
                                   });
                               }}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <button className="btn btn-primary" onClick={this.login}>
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>;
    }
}

Login.propTypes = {
    dispatch: React.PropTypes.func,
    router: React.PropTypes.object
};

function select(state) {
    return {
        data: state
    };
}

export default connect(select)(withRouter(Login));
