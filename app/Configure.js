/**
 * Created by Daniel on 7/26/2016.
 */
"use strict";

import React from "react";

const Configure = React.createClass({

  getInitialState() {
    return {
      intervalBetweenDryCheck: 0,
      intervalBetweenToiletVisit: 0,
      traineeDurationOnToilet: 0,
      rewardForVoiding: ""
    };
  },

  handleDryCheckChange(event) {
    this.setState({
      intervalBetweenDryCheck: event.target.value
    });
  },

  handleToiletVisitChange(event) {
    this.setState({
      intervalBetweenToiletVisit: event.target.value
    });
  },

  handleTraineeDurationChange(event) {
    this.setState({
      traineeDurationOnToilet: event.target.value
    });
  },

  handleRewardChange(event) {
    this.setState({
      rewardForVoiding: event.target.value
    });
  },

  save(event) {
    event.preventDefault();
    console.log(this.state);
  },

  render() {
    return <div>
      <h4>Configure</h4>
      <form className="form-horizontal">
        <div className="form-group">
          <label htmlFor="dryCheck" className="col-sm-2 control-label">Interval Between Dry Checks</label>
          <div className="col-sm-10">
            <div className="input-group">
              <input type="number" className="form-control" id="dryCheck"
                     value={this.state.intervalBetweenDryCheck}
                     onChange={this.handleDryCheckChange}/>
              <div className="input-group-addon">minute(s)</div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="toiletVisit" className="col-sm-2 control-label">Interval Between Toilet Visits</label>
          <div className="col-sm-10">
            <div className="input-group">
              <input type="number" className="form-control" id="toiletVisit"
                     value={this.state.intervalBetweenToiletVisit}
                     onChange={this.handleToiletVisitChange}/>
              <div className="input-group-addon">minute(s)</div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="traineeDuration" className="col-sm-2 control-label">Trainee Duration on Toilet</label>
          <div className="col-sm-10">
            <div className="input-group">
              <input type="number" className="form-control" id="traineeDuration"
                     value={this.state.traineeDurationOnToilet}
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
                      value={this.state.rewardForVoiding}
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

export default Configure;
