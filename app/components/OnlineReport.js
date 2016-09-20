/**
 * Created by halversondm on 9/16/16.
 */
"use strict";
import React, {Component} from "react";
import ReactDataGrid from "react-data-grid";
import {Toolbar, Data} from "react-data-grid/addons";
import "react-data-grid/dist/react-data-grid.css";
import {connect} from "react-redux";
import {MonthView} from "react-date-picker";
import moment from "moment-timezone";

var columns = [
    {key: "date", name: "Date and Time", sortable: true},
    {key: "duration", name: "Duration on the Toilet", sortable: true, filterable: true},
    {key: "typeOfActivity", name: "Type of Activity", sortable: true, filterable: true},
    {key: "typeOfVoid", name: "Type of Void", sortable: true, filterable: true},
    {key: "notes", name: "Notes"},
    {key: "promptedVisit", name: "Was the Visit Prompted?", sortable: true, filterable: true}
];

const timeZone = new Date();
const beginOfDay = "T00:00:00.000-" + timeZone.getTimezoneOffset() / 60;
const endOfDay = "T23:59:59.999-" + timeZone.getTimezoneOffset() / 60;
const dateFormat = "MM/DD/YYYYTHH:mm:ss.SSSZ";

class OnlineReport extends Component {
    constructor(props) {
        super(props);
        var date = moment().format("MM/DD/YYYY");
        this.state = {
            rows: [],
            filters: {},
            sortColumn: null,
            sortDirection: null,
            activeDate: date,
            rangeStart: date,
            rangeEnd: date,
            hiddenMonthView: true
        };
        this.rows = this.rows.bind(this);
        this.handleGridSort = this.handleGridSort.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.onClearFilters = this.onClearFilters.bind(this);
        this.getRows = this.getRows.bind(this);
        this.onRangeChange = this.onRangeChange.bind(this);
        this.onActiveDateChange = this.onActiveDateChange.bind(this);
        this.onDateChangeClick = this.onDateChangeClick.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        var data = JSON.stringify({
            profileId: this.props.profileId,
            rangeStart: moment(this.state.rangeStart + beginOfDay, dateFormat),
            rangeEnd: moment(this.state.rangeEnd + endOfDay, dateFormat)
        });
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/reportData");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                const response = JSON.parse(xhr.responseText);
                var items = response.Items.map(item => {
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
        var state = Object.assign({}, this.state, {sortColumn: sortColumn, sortDirection: sortDirection});
        this.setState(state);
    }

    handleFilterChange(filter) {
        console.log(filter);
        var newFilters = Object.assign({}, this.state.filters);
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

    onActiveDateChange(dateString) {
        this.setState({activeDate: dateString});
    }

    onRangeChange(dateArray) {
        if (dateArray.length === 0) {
            this.setState({
                rangeStart: this.state.activeDate,
                rangeEnd: this.state.activeDate
            });
        } else {
            this.setState({
                rangeStart: dateArray[0],
                rangeEnd: dateArray[1]
            });
        }
    }

    onDateChangeClick(event) {
        event.preventDefault();
        var hiddenMonthView = !this.state.hiddenMonthView;
        this.setState({hiddenMonthView: hiddenMonthView});
        if (hiddenMonthView) {
            this.getData();
        }
    }

    render() {
        var rangeStart = this.state.rangeStart;
        var rangeEnd = this.state.rangeEnd;
        return (
            <div>
                <div className="row">
                    <label className="col-sm-2">Date Range</label>
                    <button className="btn btn-default col-sm-2"
                            onClick={this.onDateChangeClick}>{rangeStart + " - " + rangeEnd}</button>
                    <div className="col-sm-3">
                        <MonthView hidden={this.state.hiddenMonthView}
                                   locale="en"
                                   weekNumbers={false}
                                   weekStartDay={0}
                                   footer={false}
                                   dateFormat="MM/DD/YYYY"
                                   defaultRange={[this.state.rangeStart, this.state.rangeEnd]}
                                   onActiveDateChange={this.onActiveDateChange}
                                   onRangeChange={this.onRangeChange}/>
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

OnlineReport.propTypes = {
    profileId: React.PropTypes.string
};

function select(state) {
    return {profileId: state.profileId};
}

export default connect(select)(OnlineReport);
