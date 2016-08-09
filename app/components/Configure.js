/**
 * Created by Daniel on 7/26/2016.
 */
"use strict";

import React from "react";
import {connect} from "react-redux";

const Configure = React.createClass({

    propTypes: {
        data: React.PropTypes.object
    },

    getInitialState() {
        return this.props.data;
    },

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.setState(nextProps.data);
    },

    handleDryCheckChange(event) {
        var config = this.state.config;
        config.intervalBetweenDryCheck = event.target.value;
        this.setState({config: config});
    },

    handleToiletVisitChange(event) {
        var config = this.state.config;
        config.intervalBetweenToiletVisit = event.target.value;
        this.setState({config: config});
    },

    handleTraineeDurationChange(event) {
        var config = this.state.config;
        config.traineeDurationOnToilet = event.target.value;
        this.setState({config: config});
    },

    handleRewardChange(event) {
        var config = this.state.config;
        config.rewardForVoiding = event.target.value;
        this.setState({config: config});
    },

    save(event) {
        event.preventDefault();
        var currentState = this.state;
        var dataToSend = Object.assign({}, currentState, {emailAddress: this.props.data.loginForm.email});
        var data = JSON.stringify(dataToSend);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/saveConfig");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                console.log("saved config");
            } else {
                console.log("unsucc ", xhr.responseText);
            }
        };
        xhr.onerror = () => {
            console.log(xhr);
        };
        xhr.send(data);
    },

    render() {
        return <div>
            <h4>Configure</h4>
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="dryCheck" className="col-sm-2 control-label">Interval
                        Between Dry Checks</label>
                    <div className="col-sm-10">
                        <div className="input-group">
                            <input type="number" className="form-control" id="dryCheck"
                                   value={this.state.config.intervalBetweenDryCheck}
                                   onChange={this.handleDryCheckChange}/>
                            <div className="input-group-addon">minute(s)</div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="toiletVisit" className="col-sm-2 control-label">Interval
                        Between Toilet Visits</label>
                    <div className="col-sm-10">
                        <div className="input-group">
                            <input type="number" className="form-control" id="toiletVisit"
                                   value={this.state.config.intervalBetweenToiletVisit}
                                   onChange={this.handleToiletVisitChange}/>
                            <div className="input-group-addon">minute(s)</div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="traineeDuration" className="col-sm-2 control-label">Trainee
                        Duration on Toilet</label>
                    <div className="col-sm-10">
                        <div className="input-group">
                            <input type="number" className="form-control" id="traineeDuration"
                                   value={this.state.config.traineeDurationOnToilet}
                                   onChange={this.handleTraineeDurationChange}/>
                            <div className="input-group-addon">minute(s)</div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="reward"
                           className="col-sm-2 control-label">Reward For Voiding</label>
                    <div className="col-sm-10">
            <textarea className="form-control" id="notes"
                      value={this.state.config.rewardForVoiding}
                      onChange={this.handleRewardChange}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <button className="btn btn-md btn-success" onClick={this.save}>
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>;
    }
});

function select(state) {
    return {
        data: state
    };
}

export default connect(select)(Configure);
