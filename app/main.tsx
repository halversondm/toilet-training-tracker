/**
 * Created by Daniel on 7/26/2016.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import App from "./components/App";
import "./main.css";
import { trackerStore } from "./reducers";

const store: any = createStore(trackerStore);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById("root"));
