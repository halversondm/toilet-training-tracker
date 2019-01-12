/**
 * Created by Daniel on 7/26/2016.
 */
import {DateInput, IDateFormatProps} from "@blueprintjs/datetime";
import * as moment from "moment";
import * as objectAssign from "object-assign";
import * as React from "react";
import {connect} from "react-redux";
import {ConnectedState, mapStateToProps} from "./ConnectedState";

export interface TrackState {
    date: Date;
    typeOfActivity: string;
    duration: number;
    typeOfVoid: string;
    promptedVisit: string;
    notes: string;
}

class Track extends React.Component<any & ConnectedState & any, TrackState> {

    constructor(props) {
        super(props);
        this.initialState = this.initialState.bind(this);
        this.state = this.initialState();
        this.save = this.save.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.typeOfActivityChange = this.typeOfActivityChange.bind(this);
        this.typeOfVoidChange = this.typeOfVoidChange.bind(this);
        this.durationChange = this.durationChange.bind(this);
        this.promptedVisitChange = this.promptedVisitChange.bind(this);
        this.notesChange = this.notesChange.bind(this);
        this.getMomentFormatter = this.getMomentFormatter.bind(this);
    }

    initialState() {
        return {
            date: new Date(),
            typeOfActivity: "",
            duration: 0,
            typeOfVoid: "",
            promptedVisit: "",
            notes: "",
        };
    }

    save(event) {
        event.preventDefault();
        const currentState: any = objectAssign({}, this.state, {profileId: this.props.data.profileId});
        currentState.date = moment.utc(currentState.date);
        const data = JSON.stringify(currentState);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/saveTrack");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                this.setState(this.initialState());
            } else {
                console.log("unsucc ", xhr.responseText);
            }
        };
        xhr.onerror = () => {
            console.log(xhr);
        };
        xhr.send(data);
    }

    onDateChange(date) {
        this.setState({date});
    }

    typeOfActivityChange(event) {
        this.setState({typeOfActivity: event.target.value});
    }

    typeOfVoidChange(event) {
        this.setState({typeOfVoid: event.target.value});
    }

    durationChange(event) {
        this.setState({duration: event.target.value});
    }

    promptedVisitChange(event) {
        this.setState({promptedVisit: event.target.value});
    }

    notesChange(event) {
        this.setState({notes: event.target.value});
    }

    getMomentFormatter(format: string): IDateFormatProps {
        return {
            formatDate: (date, locale) => moment(date).locale(locale).format(format),
            parseDate: (str, locale) => moment(str, format).locale(locale).toDate(),
            placeholder: format,
        };
    }

    render() {
        return (
            <div>
                <h4>Tracking</h4>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="date" className="col-sm-2 control-label">Date</label>
                        <div className="col-sm-10">
                            <DateInput {...this.getMomentFormatter("MM/DD/YYYY hh:mm a")}
                                       locale="en" onChange={this.onDateChange} value={this.state.date}
                                       timePrecision="minute" timePickerProps={{useAmPm: true}}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="typeOfVisit" className="col-sm-2 control-label">Type
                            of Activity</label>
                        <div className="col-sm-10">
                            <select id="typeOfActivity" className="form-control"
                                    onChange={this.typeOfActivityChange}
                                    value={this.state.typeOfActivity}>
                                <option value=""/>
                                <option value="Toilet Visit">Toilet Visit</option>
                                <option value="Underwear Check">Underwear Check</option>
                            </select>
                        </div>
                    </div>
                    <div hidden={this.state.typeOfActivity !== "Underwear Check"}>
                        <div className="form-group">
                            <label htmlFor="typeOfVoid" className="col-sm-2 control-label">Wet
                                or Dry?</label>
                            <div className="col-sm-10">
                                <select id="typeOfVoid" className="form-control"
                                        value={this.state.typeOfVoid}
                                        onChange={this.typeOfVoidChange}>
                                    <option value=""/>
                                    <option value="Wet">Wet</option>
                                    <option value="Dry">Dry</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div hidden={this.state.typeOfActivity !== "Toilet Visit"}>
                        <div className="form-group">
                            <label htmlFor="duration" className="col-sm-2 control-label">Time
                                Duration of Toilet Visit</label>
                            <div className="col-sm-10">
                                <div className="input-group">
                                    <input type="number" className="form-control" id="duration"
                                           value={this.state.duration}
                                           onChange={this.durationChange}/>
                                    <div className="input-group-addon">minute(s)</div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="typeOfVoid" className="col-sm-2 control-label">Type
                                of
                                Void</label>
                            <div className="col-sm-10">
                                <select id="typeOfVoid" className="form-control"
                                        value={this.state.typeOfVoid}
                                        onChange={this.typeOfVoidChange}>
                                    <option value=""/>
                                    <option value="Urine">Urine</option>
                                    <option value="Bowel Movement">Bowel Movement</option>
                                    <option value="Both">Both</option>
                                    <option value="None">None</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="prompted" className="col-sm-2 control-label">Prompted Visit?</label>
                            <div className="col-sm-10">
                                <select id="prompted" className="form-control"
                                        value={this.state.promptedVisit}
                                        onChange={this.promptedVisitChange}>
                                    <option value=""/>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="notes"
                               className="col-sm-2 control-label">Notes</label>
                        <div className="col-sm-10">
                            <textarea className="form-control" id="notes"
                                      value={this.state.notes}
                                      onChange={this.notesChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button className="btn btn-primary" onClick={this.save}>
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Track);
