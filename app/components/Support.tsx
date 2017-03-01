/**
 * Created by halversondm on 2/22/17.
 */
"use strict";

import * as React from "react";

class Support extends React.Component<any, any> {

    render() {
        return (
            <div>
                <p>If you need support for this application or the mobile application please email us at:</p>
                <a href="mailto:toilet.training.tracker@gmail.com">Toilet Training Tracker</a>
                <p>We are willing to do the following:</p>
                <ul>
                    <li>Reset your account password to a password you choose. You must email from the account that is
                        your login.
                    </li>
                    <li>Return your data to you and delete your account. You must email from the account that is your
                        login.
                    </li>
                    <li>Answer any question you may have about the application</li>
                    <li>Take any suggestion for improvement on the application</li>
                    <li>Listen to your success stories!</li>
                </ul>
            </div>
        );
    }
}

export default Support;
