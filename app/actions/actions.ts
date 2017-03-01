"use strict";

export interface Action {
    type: ActionType,
    loginForm?: Object,
    config?: Object,
    profileId?: string
}

export enum ActionType {
    UPDATE_AUTH_FORM,
    AUTHENTICATED,
    NOT_AUTHENTICATED,
    SET_CONFIG
}