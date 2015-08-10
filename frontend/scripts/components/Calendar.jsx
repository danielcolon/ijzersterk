import React from 'react';
import moment from 'moment';
import Month from './Month.jsx';

export
default React.createClass({
    getInitialState() {
        return {
            date: moment()
        };
    },
    renderWeekCell(week){
        return <div className="cal-cell1">{week}</div>;
    },
    prevMonth(){
        this.setState({
            date: this.state.date.add(-1, 'month')
        });
    },
    nextMonth(){
        this.setState({
            date: this.state.date.add(1, 'month')
        });
    },
    resetDate(){
        this.setState({
            date: moment()
        });
    },
    render() {
        return (
            <div>
                <div className="page-header">
                    <span className="pull-right form-inline">
                        <div className="btn-group">
                            <button className="btn btn-primary" onClick={this.prevMonth}>&lt;&lt; Prev</button>
                            <button className="btn btn-primary" onClick={this.resetDate}>Today</button>
                            <button className="btn btn-primary" onClick={this.nextMonth}>Next &gt;&gt;</button>
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-warning active">Month</button>
                            <button className="btn btn-warning">Day</button>
                        </div>
                    </span>
                    <h3>{this.state.date.format('MMMM YYYY')}</h3>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="cal-context">
                            <div className="cal-row-fluid cal-row-head">
                                {moment.weekdays().map(this.renderWeekCell)}
                            </div>
                            <Month date={this.state.date.format('YYYY-MM-DD')}></Month>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
