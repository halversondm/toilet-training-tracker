/**
 * Created by Daniel on 7/26/2016.
 */
"use strict";

import React from "react";
import {DateField} from "react-date-picker";
import moment from "moment";
import {connect} from "react-redux";
import "react-date-picker/index.css";

const Track = React.createClass({

    propTypes: {
        profileId: React.PropTypes.number
    },

    getInitialState() {
        return {
            date: moment(),
            typeOfActivity: "",
            duration: 0,
            typeOfVoid: "",
            promptedVisit: "",
            notes: ""
        };
    },

    handleDateChange(date) {
        this.setState({
            date: date
        });
    },

    handleTypeOfActivity(event) {
        this.setState({
            typeOfActivity: event.target.value
        });
    },

    handleTypeOfVoidClick(event) {
        this.setState({
            typeOfVoid: event.target.value
        });
    },

    handleDurationChange(event) {
        this.setState({
            duration: event.target.value
        });
    },

    handleTypeOfVoidChange(event) {
        this.setState({
            typeOfVoid: event.target.value
        });
    },

    handlePromptedVisitChange(event) {
        this.setState({
            promptedVisit: event.target.value
        });
    },

    handleNotesChange(event) {
        this.setState({
            notes: event.target.value
        });
    },

    save(event) {
        event.preventDefault();
        var currentState = this.state;
        Object.keys(currentState).forEach(key => {
            if (currentState[key] === "") {
                delete currentState[key];
            }
        });
        var dataToSend = Object.assign({}, currentState, {profileId: this.props.profileId});
        var data = JSON.stringify(dataToSend);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/saveTrack");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                this.setState(this.getInitialState());
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
        return <div><h4>Tracking</h4>
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="date" className="col-sm-2 control-label">Date</label>
                    <div className="col-sm-10">
                        <DateField id="date" forceValidDate
                                   dateFormat="MM/DD/YYYY hh:mm a"
                                   defaultValue={this.state.date}
                                   onChange={this.handleDateChange}/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="typeOfVisit" className="col-sm-2 control-label">Type
                        of Activity</label>
                    <div className="col-sm-10">
                        <select id="typeOfActivity" className="form-control"
                                onChange={this.handleTypeOfActivity}
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
                                    onChange={this.handleTypeOfVoidClick}>
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
                                       onChange={this.handleDurationChange}/>
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
                                    onChange={this.handleTypeOfVoidChange}>
                                <option value=""/>
                                <option value="Urine">Urine</option>
                                <option value="Bowel Movement">Bowel Movement</option>
                                <option value="Both">Both</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="prompted" className="col-sm-2 control-label">Prompted Visit?</label>
                        <div className="col-sm-10">
                            <select id="prompted" className="form-control"
                                    value={this.state.promptedVisit}
                                    onChange={this.handlePromptedVisitChange}>
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
                      onChange={this.handleNotesChange}/>
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
        profileId: state.profileId
    };
}

export default connect(select)(Track);
