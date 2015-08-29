import React from 'react';
import moment from 'moment';
import Month from './Month.jsx';
import Day from './Day.jsx';
import CalendarControls from './CalendarControls.jsx';
export
default React.createClass({
    getInitialState() {
        return {
            date: moment(),
            view: 'month'
        };
    },
    prev() {
        this.setState({
            date: this.state.date.add(-1, this.state.view)
        });
    },
    next() {
        this.setState({
            date: this.state.date.add(1, this.state.view)
        });
    },
    reset() {
        this.setState({
            date: moment()
        });
    },
    toggleView(view, date) {
        this.setState({
            view: view,
            date: date
        });
    },
    renderView() {
        if (this.state.view === 'month') {
            return <Month key={2}
                date={this.state.date}
                toggleView={this.toggleView}></Month>;
        } else if (this.state.view === 'day') {
            return <Day key={2} date={this.state.date}></Day>;
        }
    },
    renderDate() {
        if (this.state.view === 'month') {
            return this.state.date.format('MMMM YYYY');
        }
        return this.state.date.format('dddd DD MMMM, YYYY');
    },
    render() {
        return (
            <div id="calendar">
                <div className="page-header">
                    <CalendarControls className="pull-right form-inline"
                        next={this.next} prev={this.prev} reset={this.reset}
                        view={this.state.view} toggleView={this.toggleView} date={this.state.date}/>
                    <h3>{this.renderDate()}</h3>
                </div>
                <div className="cal-context">
                    {this.renderView()}
                </div>
            </div>
        );
    }
});
