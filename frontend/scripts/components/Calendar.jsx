import React from 'react';
import moment from 'moment';
import Month from './Month.jsx';
import classNames from 'classnames';
import Day from './Day.jsx';

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
    resetDate() {
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
        var monthClasses = classNames('btn', 'btn-warning', {
            'active': this.state.view === 'month'
        });
        var dayClasses = classNames('btn', 'btn-warning', {
            'active': this.state.view === 'day'
        });
        return (
            <div id="calendar">
                <div className="page-header">
                    <span className="pull-right form-inline">
                        <div className="btn-group">
                            <button className="btn btn-primary" onClick={this.prev}>&lt;&lt; Prev</button>
                            <button className="btn btn-primary" onClick={this.resetDate}>Today</button>
                            <button className="btn btn-primary" onClick={this.next}>Next &gt;&gt;</button>
                        </div>
                        <div className="btn-group">
                            <button className={monthClasses}
                                onClick={this.toggleView.bind(null, 'month', this.state.date)}>
                                    Month
                            </button>
                            <button className={dayClasses}
                                onClick={this.toggleView.bind(null, 'day', this.state.date)}>
                                Day
                            </button>
                        </div>
                    </span>
                    <h3>{this.renderDate()}</h3>
                </div>
                <div className="cal-context">
                    {this.renderView()}
                </div>
            </div>
        );
    }
});
