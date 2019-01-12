/**
 * Created by halversondm on 9/16/16.
 */
import {DateRangeInput, IDateFormatProps} from "@blueprintjs/datetime";
import * as moment from "moment";
import * as objectAssign from "object-assign";
import * as React from "react";
import * as ReactDataGrid from "react-data-grid";
import {Data, Toolbar} from "react-data-grid-addons";
import {connect} from "react-redux";
import {ConnectedState, mapStateToProps} from "./ConnectedState";

const columns = [
    {key: "date", name: "Date and Time", sortable: true},
    {key: "duration", name: "Duration on the Toilet", sortable: true, filterable: true},
    {key: "typeOfActivity", name: "Type of Activity", sortable: true, filterable: true},
    {key: "typeOfVoid", name: "Type of Void", sortable: true, filterable: true},
    {key: "notes", name: "Notes"},
    {key: "promptedVisit", name: "Was the Visit Prompted?", sortable: true, filterable: true},
];

const timeZone = new Date();
const beginOfDay = "T00:00:00.000-" + timeZone.getTimezoneOffset() / 60;
const endOfDay = "T23:59:59.999-" + timeZone.getTimezoneOffset() / 60;
const dateFormat = "MM/DD/YYYYTHH:mm:ss.SSSZ";

class OnlineReport extends React.Component<any & ConnectedState & any, any> {

    state: any;

    constructor(props) {
        super(props);
        const date = new Date();
        this.state = {
            rows: [],
            filters: {},
            sortColumn: null,
            sortDirection: null,
            activeDate: date,
            rangeStart: date,
            rangeEnd: date,
            hiddenMonthView: true,
            downloadMessage: "",
        };
        this.rows = this.rows.bind(this);
        this.handleGridSort = this.handleGridSort.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.onClearFilters = this.onClearFilters.bind(this);
        this.getRows = this.getRows.bind(this);
        this.onRangeChange = this.onRangeChange.bind(this);
        this.onActiveDateChange = this.onActiveDateChange.bind(this);
        this.getData = this.getData.bind(this);
        this.download = this.download.bind(this);
        this.getMomentFormatter = this.getMomentFormatter.bind(this);
    }

    getData(event) {
        const rangeStart = moment(this.state.rangeStart).format("MM/DD/YYYY") + beginOfDay;
        const rangeEnd = moment(this.state.rangeEnd).format("MM/DD/YYYY") + endOfDay;
        const data = JSON.stringify({
            profileId: this.props.data.profileId,
            rangeStart: moment(rangeStart, dateFormat),
            rangeEnd: moment(rangeEnd, dateFormat),
        });
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/reportData");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                const response = JSON.parse(xhr.responseText);
                const items = response.Items.map((item) => {
                    item.date = moment(item.date).format("YYYY-MM-DD HH:mm");
                    return item;
                });
                this.setState({rows: items});
            } else {
                console.log("unsucc ", xhr.responseText);
                this.setState({error: true});
            }
        };
        xhr.onerror = () => {
            console.log(xhr);
        };
        xhr.send(data);
    }

    getRows() {
        return Data.Selectors.getRows(this.state);
    }

    getSize() {
        return this.getRows().length;
    }

    rows(i) {
        return this.getRows()[i];
    }

    handleGridSort(sortColumn, sortDirection) {
        const state = objectAssign({}, this.state, {sortColumn, sortDirection});
        this.setState(state);
    }

    handleFilterChange(filter) {
        const newFilters = objectAssign({}, this.state.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({filters: newFilters});
    }

    onClearFilters() {
        this.setState({filters: {}});
    }

    onActiveDateChange(dateString: string) {
        this.setState({activeDate: dateString});
    }

    onRangeChange(dateArray) {
        if (dateArray.length === 0) {
            this.setState({
                rangeStart: this.state.activeDate,
                rangeEnd: this.state.activeDate,
            });
        } else {
            this.setState({
                rangeStart: dateArray[0],
                rangeEnd: dateArray[1],
            });
        }
    }

    download(event) {
        event.preventDefault();
        const data = JSON.stringify({
            profileId: this.props.data.profileId,
            rangeStart: moment(this.state.rangeStart + beginOfDay, dateFormat),
            rangeEnd: moment(this.state.rangeEnd + endOfDay, dateFormat),
        });
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/excel");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                let filename = "";
                const disposition = xhr.getResponseHeader("Content-Disposition");
                if (disposition && disposition.indexOf("attachment") !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);
                    if (matches !== null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, "");
                    }
                }
                const type = xhr.getResponseHeader("Content-Type");
                const blob = new Blob([xhr.response], {type});
                const anchor = document.createElement("a");
                const downloadUrl = window.URL.createObjectURL(blob);
                anchor.style.display = "none";
                if (typeof anchor.download === "undefined") {
                    window.location.href = downloadUrl;
                } else {
                    anchor.href = downloadUrl;
                    anchor.download = filename;
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);
                }
                setTimeout(() => {
                    URL.revokeObjectURL(downloadUrl);
                }, 100);
            } else if (xhr.status === 404) {
                this.setState({downloadMessage: "No file available for date range."});
            }
        };
        xhr.onerror = () => {
            console.log(xhr);
        };
        xhr.send(data);
    }

    getMomentFormatter(format: string): IDateFormatProps {
        return {
            formatDate: (date, locale) => moment(date).locale(locale).format(format),
            parseDate: (str, locale) => moment(str, format).locale(locale).toDate(),
            placeholder: format,
        };
    }

    render() {
        return (
            <div>
                <div className="row">
                    <label className="col-sm-2">Date Range</label>
                    <div className="col-sm-4">
                        <DateRangeInput {...this.getMomentFormatter("MM/DD/YYYY")} locale="en"
                                        onChange={this.onRangeChange}
                                        allowSingleDayRange={true}
                                        value={[this.state.rangeStart, this.state.rangeEnd]}/>
                    </div>
                    <div className="col-sm-1">
                        <button className="btn btn-primary btn-sm"
                                onClick={this.getData}>Search
                        </button>
                    </div>
                    <div className="col-sm-5">
                        <button className="btn btn-success btn-sm" style={{float: "right"}}
                                title="Download Excel" onClick={this.download}>
                            <i className="fa fa-file-excel-o"
                               aria-hidden="true"/>
                        </button>
                    </div>
                </div>
                <ReactDataGrid columns={columns} minHeight={500} rowGetter={this.rows}
                               toolbar={<Toolbar enableFilter={true}/>}
                               onAddFilter={this.handleFilterChange}
                               onClearFilters={this.onClearFilters}
                               rowsCount={this.getSize()} onGridSort={this.handleGridSort}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(OnlineReport);
