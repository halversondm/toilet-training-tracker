/**
 * Created by Daniel on 8/2/2016.
 */
import * as React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";
import { ActionCreators, temp } from "../actions";
import { ConnectedState, mapStateToProps} from "./ConnectedState";

class Login extends React.Component<ConnectedState & ActionCreators, any> {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            key: "",
            redirect: false,
        };
        this.login = this.login.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.emailChange = this.emailChange.bind(this);
    }

    componentDidMount() {
        this.props.notAuthenticated();
    }

    login(event) {
        event.preventDefault();
        this.props.updateForm(this.state.email, this.state.key);
        const data = JSON.stringify(this.state);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/loginService");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                const response = JSON.parse(xhr.responseText);
                this.props.authenticated();
                this.props.setConfig(response.config, response.profileId);
                this.setState({redirect: true});
            } else {
                console.log("unsucc ", xhr.responseText);
                this.props.notAuthenticated();
                this.setState({ error: true });
            }
        };
        xhr.onerror = () => {
            console.log(xhr);
        };
        xhr.send(data);
    }

    passwordChange(event) {
        this.setState({ key: event.target.value, error: false });
    }

    emailChange(event) {
        this.setState({ email: event.target.value, error: false });
    }

    render() {
        if (this.state.redirect) {
            return (
                <Redirect to="/track" />
            );
        }

        return (
            <div>
                <div className="alert alert-danger alert-dismissible" role="alert"
                    hidden={!this.state.error}>
                    <button type="button" className="close" data-dismiss="alert"><span
                        aria-hidden={true}>&times;</span></button>
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
                                onChange={this.emailChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"
                            className="col-sm-2 control-label">Password</label>
                        <div className="col-sm-10">
                            <input type="password" className="form-control" id="password"
                                value={this.state.key}
                                onChange={this.passwordChange} />
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
            </div>
        )
            ;
    }
}

function mapDispatchToProps(dispatch): ActionCreators {
    return bindActionCreators(temp, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
