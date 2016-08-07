/**
 * Created by Daniel on 8/3/2016.
 */
"use strict";

const initialState = {
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
  profileId: 0
};

const trackerState = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_AUTH_FORM":
      return Object.assign({}, state, {loginForm: action.loginForm});
    case "AUTHENTICATED":
      return Object.assign({}, state, {authenticated: true});
    case "NOT_AUTHENTICATED":
      return Object.assign({}, state, {authenticated: false});
    case "SET_CONFIG":
      return Object.assign({}, state, {config: action.config, profileId: action.profileId});
    default:
      return state;
  }
};

export default trackerState;
