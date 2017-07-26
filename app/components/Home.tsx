import * as React from "react";
import { Link } from "react-router-dom";

// tslint:disable-next-line
const appStore = require("../images/Download_on_the_App_Store_Badge_US-UK_135x40.svg");

export class Home extends React.Component<any, any> {

    // tslint:disable-next-line
    private googleUrl: string = "https://play.google.com/store/apps/details?id=com.toilettrainingtracker&utm_source=global_co&utm_medium=prtnr&utm_content=Mar2515&utm_campaign=PartBadge&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1";

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12">
                        The Toilet Training Tracker aims to help parents, therapists and caregivers the ability to track
                        on-the-go toilet data for those in training. The application can report on data for download and
                        analysis. Please login to your existing account or sign-up for a new account below.
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-xs-12">
                        <Link to="login">
                            <button type="button" className="btn btn-primary">Login</button>
                        </Link>
                        <Link to="signup">
                            <button type="button" className="btn btn-primary">Sign-up</button>
                        </Link>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-sm-12">
                        Please see our mobile app available on Google Play and Apple App Store below.
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-2">
                        <a href={this.googleUrl}>
                            <img alt="Get it on Google Play"
                                src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
                                style={{ width: "135px", height: "48px" }} />
                        </a>
                    </div>
                    <div className="col-sm-2">
                        <a href="https://appsto.re/us/d7QVeb.i">
                            <img alt="Get in on the App Store" style={{ paddingTop: "8px" }}
                                src={appStore} />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
