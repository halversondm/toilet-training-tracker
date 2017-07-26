/**
 * Created by Daniel on 7/26/2016.
 */
import * as objectAssign from "object-assign";
import * as React from "react";
import { connect } from "react-redux";
import { TrackerState } from "../reducers/index";
import { ConnectedState, mapStateToProps } from "./ConnectedState";

class Configure extends React.Component<any & ConnectedState & any, any> {

    state: any;
    intervalId: number;

    constructor(props) {
        super(props);
        this.state = objectAssign({}, this.props.data, { message: "" });
        this.handleDryCheckChange = this.handleDryCheckChange.bind(this);
        this.handleToiletVisitChange = this.handleToiletVisitChange.bind(this);
        this.handleRewardChange = this.handleRewardChange.bind(this);
        this.handleTraineeDurationChange = this.handleTraineeDurationChange.bind(this);
        this.save = this.save.bind(this);
        this.clearMessage = this.clearMessage.bind(this);
    }

    componentDidMount() {
        this.intervalId = setInterval(this.clearMessage, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.setState(nextProps.data);
    }

    handleDryCheckChange(event) {
        const config = this.state.config;
        config.intervalBetweenDryCheck = event.target.value;
        this.setState({ config });
    }

    handleToiletVisitChange(event) {
        const config = this.state.config;
        config.intervalBetweenToiletVisit = event.target.value;
        this.setState({ config });
    }

    handleTraineeDurationChange(event) {
        const config = this.state.config;
        config.traineeDurationOnToilet = event.target.value;
        this.setState({ config });
    }

    handleRewardChange(event) {
        const config = this.state.config;
        config.rewardForVoiding = event.target.value;
        this.setState({ config });
    }

    save(event) {
        event.preventDefault();
        const currentState = this.state;
        const dataToSend = objectAssign({}, currentState, { emailAddress: this.props.data.loginForm.email });
        const data = JSON.stringify(dataToSend);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/saveConfig");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                this.setState({ message: "  Saved!" });
            } else {
                this.setState({ message: "  There was an error saving your request. Please try again later" });
            }
        };
        xhr.onerror = () => {
            this.setState({ message: "  Please check your internet connection and try again" });
        };
        xhr.send(data);
    }

    clearMessage() {
        this.setState({ message: "" });
    }

    render() {
        return (
            <div>
                <h4>Configure</h4>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="dryCheck" className="col-sm-2 control-label">Interval
                            Between Dry Checks</label>
                        <div className="col-sm-10">
                            <div className="input-group">
                                <input type="number" className="form-control" id="dryCheck"
                                    value={this.state.config.intervalBetweenDryCheck}
                                    onChange={this.handleDryCheckChange} />
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
                                    onChange={this.handleToiletVisitChange} />
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
                                    onChange={this.handleTraineeDurationChange} />
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
                                onChange={this.handleRewardChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-2">
                            <button className="btn btn-primary" onClick={this.save}>
                                Save
                            </button>
                            {this.state.message}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Configure);
