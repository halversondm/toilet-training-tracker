/**
 * Created by halversondm on 9/9/16.
 */
import * as React from "react";
import { Redirect } from "react-router-dom";

export class Signup extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {name: "", email: "", key: "", keyRetype: "", redirect: false};
        this.signup = this.signup.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.keyChange = this.keyChange.bind(this);
        this.keyRetypeChange = this.keyRetypeChange.bind(this);
    }

    signup(event) {
        event.preventDefault();
        if (this.state.key !== this.state.keyRetype) {
            return;
        }
        const data = JSON.stringify(this.state);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/signup");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                this.setState({redirect: true});
            } else {
                console.log("unsucc ", xhr.responseText);
            }
        };
        xhr.onerror = () => {
            console.log(xhr);
        };
        xhr.send(data);
    }

    nameChange(event) {
        this.setState({name: event.target.value});
    }

    emailChange(event) {
        this.setState({email: event.target.value});
    }

    keyChange(event) {
        this.setState({key: event.target.value});
    }

    keyRetypeChange(event) {
        this.setState({keyRetype: event.target.value});
    }

    render() {
        if (this.state.redirect) {
            return (
                <Redirect to="/successSignup" />
            );
        }
        return (
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="name"
                           className="col-sm-2 control-label">Name</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="name"
                               value={this.state.name}
                               onChange={this.nameChange}/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="email"
                           className="col-sm-2 control-label">Email Address</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" id="email"
                               value={this.state.email}
                               onChange={this.emailChange}/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password"
                           className="col-sm-2 control-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="password"
                               value={this.state.key}
                               onChange={this.keyChange}/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password"
                           className="col-sm-2 control-label">Re-type Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="password"
                               value={this.state.keyRetype}
                               onChange={this.keyRetypeChange}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <button className="btn btn-primary" onClick={this.signup}>
                            Save
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}
