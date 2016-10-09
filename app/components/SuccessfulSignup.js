/**
 * Created by halversondm on 9/10/16.
 */
"use strict";

import React, {Component} from "react";
import {Link} from "react-router";

class SuccessfulSignup extends Component {

    render() {
        return (
            <div>
                Your sign-up was successful.
                <br/>
                <Link to="login">
                    <button type="button" className="btn btn-primary">Login</button>
                </Link>
            </div>
        );
    }
}

export default SuccessfulSignup;
