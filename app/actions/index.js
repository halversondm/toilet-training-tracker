/**
 * Created by Daniel on 8/4/2016.
 */
"use strict";

export const updateForm = (email, key) => {
  return {
    type: "UPDATE_AUTH_FORM",
    loginForm: {
      email: email,
      key: key
    }
  };
};

export const authenticated = () => {
  return {
    type: "AUTHENTICATED"
  };
};

export const notAuthenticated = () => {
  return {
    type: "NOT_AUTHENTICATED"
  };
};

export const setConfig = config => {
  return {
    type: "SET_CONFIG",
    config: config
  };
};
