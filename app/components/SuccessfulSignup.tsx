/**
 * Created by halversondm on 9/10/16.
 */
"use strict";

import * as React from "react";
import {Link} from "react-router";

class SuccessfulSignup extends React.Component<any, any> {

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
