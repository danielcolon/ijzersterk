import React from 'react';
import moment from 'moment';
import MonthDay from './MonthDay.jsx';
import _ from 'lodash';

var getFirst = function(mm) {
    return mm.date(-mm.date(1).day() + 1);
};

var getLast = function(mm) {
    return mm.date(mm.daysInMonth() + (7 - mm.date(mm.daysInMonth()).day()));
};

export
default React.createClass({
    renderWeek(week) {
        return <div className="cal-row-fluid cal-before-eventlist">{week}</div>;
    },
    renderMonth() {
        let current = getFirst(moment(this.props.date, 'YYYY-MM-DD'));
        let end = getLast(moment(this.props.date, 'YYYY-MM-DD'));
        let weeks = [];
        while (current.isBefore(end) || current.isSame(end)) {
            weeks.push(<MonthDay date={current.format('YYYY-MM-DD')} viewMonth={this.props.date}/>);
            current.add(1, 'day');
        }
        return _(weeks)
            .chunk(7)
            .map(this.renderWeek)
            .value();
    },
    render() {
        return <div className="cal-month-box">{this.renderMonth()}</div>;
    }
});
