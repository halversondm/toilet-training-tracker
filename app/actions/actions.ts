export interface Action {
    type: ActionType;
    loginForm?: {};
    config?: {};
    profileId?: string;
}

export enum ActionType {
    UPDATE_AUTH_FORM,
    AUTHENTICATED,
    NOT_AUTHENTICATED,
    SET_CONFIG,
}
