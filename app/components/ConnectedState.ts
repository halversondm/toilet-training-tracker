import { TrackerState } from "../reducers";

export interface ConnectedState {
    data: TrackerState;
}

export function mapStateToProps(state: TrackerState): ConnectedState {
    return {
        data: state,
    };
}
