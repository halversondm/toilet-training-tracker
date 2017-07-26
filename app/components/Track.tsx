/**
 * Created by Daniel on 7/26/2016.
 */
import * as moment from "moment";
import * as objectAssign from "object-assign";
import * as React from "react";
import { DateField, DatePicker, Footer } from "react-date-picker";
import "react-date-picker/index.css";
import { connect } from "react-redux";
import { TrackerState } from "../reducers/index";
import { ConnectedState, mapStateToProps} from "./ConnectedState";

class Track extends React.Component<any & ConnectedState & any, any> {

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
    }

    initialState() {
        return {
            date: moment(),
            typeOfActivity: "",
            duration: 0,
            typeOfVoid: "",
            promptedVisit: "",
            notes: "",
        };
    }

    save(event) {
        event.preventDefault();
        const currentState = this.state;
        const dataToSend = objectAssign({}, currentState, { profileId: this.props.data.profileId });
        const data = JSON.stringify(dataToSend);
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
        const newDate = moment.tz(date, "MM/DD/YYYY hh:mm a", moment.tz.guess());
        const utcDate = newDate.tz("Etc/UTC");
        this.setState({ date: utcDate });
    }

    typeOfActivityChange(event) {
        this.setState({ typeOfActivity: event.target.value });
    }

    typeOfVoidChange(event) {
        this.setState({ typeOfVoid: event.target.value });
    }

    durationChange(event) {
        this.setState({ duration: event.target.value });
    }

    promptedVisitChange(event) {
        this.setState({ promptedVisit: event.target.value });
    }

    notesChange(event) {
        this.setState({ notes: event.target.value });
    }

    render() {
        return (
            <div>
                <h4>Tracking</h4>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="date" className="col-sm-2 control-label">Date</label>
                        <div className="col-sm-10">
                            <DateField forceValidDate={true}
                                dateFormat="MM/DD/YYYY hh:mm a"
                                defaultValue={this.state.date}
                                updateOnDateClick={true}
                                onChange={this.onDateChange}>
                                <DatePicker
                                    navigation={true}
                                    locale="en"
                                    forceValidDate={true}
                                    highlightWeekends={true}
                                    highlightToday={true}
                                    weekNumbers={false}
                                    weekStartDay={0}>
                                    <Footer todayButton={false} clearButton={false} okButton={false}
                                        cancelButton={false} /></DatePicker>
                            </DateField>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="typeOfVisit" className="col-sm-2 control-label">Type
                            of Activity</label>
                        <div className="col-sm-10">
                            <select id="typeOfActivity" className="form-control"
                                onChange={this.typeOfActivityChange}
                                value={this.state.typeOfActivity}>
                                <option value="" />
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
                                    <option value="" />
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
                                        onChange={this.durationChange} />
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
                                    <option value="" />
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
                                    <option value="" />
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
                                onChange={this.notesChange} />
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
