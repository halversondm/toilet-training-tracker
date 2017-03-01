/**
 * Created by Daniel on 8/4/2016.
 */
import { ActionCreatorsMapObject } from "redux";
import { Configure } from "../reducers/index";
import {Action, ActionType} from "./actions";

"use strict";

const updateForm = (email: string, key: string) : Action => {
  return {
    type: ActionType.UPDATE_AUTH_FORM,
    loginForm: {
      email: email,
      key: key
    }
  };
};

const authenticated = () : Action => {
  return {
    type: ActionType.AUTHENTICATED
  };
};

const notAuthenticated = () : Action => {
  return {
    type: ActionType.NOT_AUTHENTICATED
  };
};

const setConfig = (config: Configure, profileId: string) : Action => {
  return {
    type: ActionType.SET_CONFIG,
    config: config,
    profileId: profileId
  };
};

export interface ActionCreators extends ActionCreatorsMapObject {
  updateForm(email: string, key: string) : Action,
  authenticated() : Action,
  notAuthenticated() : Action,
  setConfig(config: Configure, profileId: string) : Action
}

export const temp : ActionCreators = {
"updateForm": updateForm,
"authenticated": authenticated,
"notAuthenticated": notAuthenticated,
"setConfig": setConfig
}
