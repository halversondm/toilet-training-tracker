/**
 * Created by Daniel on 8/3/2016.
 */
"use strict";
import * as objectAssign from "object-assign";
import {ActionType, Action} from "../actions/actions";

export interface TrackerState {
  loginForm: LoginForm,
  authenticated: boolean,
  config: Configure,
  profileId: string
}

export interface LoginForm {
  email: string,
  key: string
}

export interface Configure {
  intervalBetweenDryCheck: number,
  intervalBetweenToiletVisit: number,
  traineeDurationOnToilet: number,
  rewardForVoiding: string
}

const initialState : TrackerState = {
  loginForm: {
    email: "",
    key: ""
  },
  authenticated: false,
  config: {
    intervalBetweenDryCheck: 0,
    intervalBetweenToiletVisit: 0,
    traineeDurationOnToilet: 0,
    rewardForVoiding: ""
  },
  profileId: "0"
};

const trackerState = (state = initialState, action : Action) : TrackerState => {
  switch (action.type) {
    case ActionType.UPDATE_AUTH_FORM:
      return objectAssign({}, state, {loginForm: action.loginForm});
    case ActionType.AUTHENTICATED:
      return objectAssign({}, state, {authenticated: true});
    case ActionType.NOT_AUTHENTICATED:
      return objectAssign({}, state, {authenticated: false});
    case ActionType.SET_CONFIG:
      return objectAssign({}, state, {config: action.config, profileId: action.profileId});
    default:
      return state;
  }
};

export default trackerState;