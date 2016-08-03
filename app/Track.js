/**
 * Created by Daniel on 7/26/2016.
 */
"use strict";

import React from "react";
import {DateField} from "react-date-picker";
import moment from "moment";
import "react-date-picker/index.css";

const Track = React.createClass({

  getInitialState() {
    return {
      startDate: moment()
    };
  },

  handleDatePickerChange(date) {
    this.setState({
      startDate: date
    });
  },

  render() {
    console.log(this.state.startDate);
    return <div><h4>Tracking</h4>
      <form className="form-horizontal">
        <div className="form-group">
          <label htmlFor="when" className="col-sm-2 control-label">When</label>
          <div className="col-sm-10">
            <DateField id="date" forceValidDate
                       dateFormat="MM/DD/YYYY hh:mm a"
                       defaultValue={this.state.startDate}
                       onChange={this.handleDatePickerChange}/>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="typeOfVisit" className="col-sm-2 control-label">Type
            of Activity</label>
          <div className="col-sm-10">
            <select id="typeOfVisit">
              <option value=""/>
              <option value="Toilet Visit">Toilet Visit</option>
              <option value="Underwear Check">Underwear Check</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="duration" className="col-sm-2 control-label">Time
            Duration of Toiled Visit</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" id="duration"/>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="typeOfVoid" className="col-sm-2 control-label">Type of
            Void</label>
          <div className="col-sm-10">
            <select id="typeOfVoid">
              <option value=""/>
              <option value="Urine">Urine</option>
              <option value="Bowel Movement">Bowel Movement</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="scheduled" className="col-sm-2 control-label">Scheduled
            Visit?</label>
          <div className="col-sm-10">
            <select id="schedule">
              <option value=""/>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="hotes"
                 className="col-sm-2 control-label">Notes</label>
          <div className="col-sm-10">
            <textarea className="form-control" id="notes"/>
          </div>
        </div>
        <div className="form-group">
          <button className="btn btn-md btn-success">Save</button>
        </div>
      </form>
    </div>;
  }
});

export default Track;
