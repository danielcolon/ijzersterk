import React from 'react';
import moment from 'moment';
import MonthDay from './MonthDay.jsx';
import _ from 'lodash';

/**
 * Gets the fist visible day of the month calendar.
 * So this is not about the first day of the month (which is 1 duh),
 * but about which day is visible in a month calendar,
 * which can be anything between 25th of the previous month to 1st of the current month.
 * @param  {Moment} mm The date for which the first should be returned
 * @return {Moment}    The first visible calendar day.
 */
var getFirst = function(mm) {
    return mm.date(-mm.date(1).day() + 1);
};

/**
 * Same as getFirst, but for the last visible day of the calendar month.
 * @param  {Moment} mm The data for which the last should be returned.
 * @return {Moment}    The last visible calendar day.
 */
var getLast = function(mm) {
    return mm.date(mm.daysInMonth() + (7 - mm.date(mm.daysInMonth()).day()));
};

export
default React.createClass({
    /**
     * Sets the initial state of the Month component.
     * @return {Object} The inital state.
     */
    getInitialState(){
        return {
            focusWeek: null
        };
    },
    /**
     * Toggles the which week is being focused.
     * @param  {String} date The date in YYYY-MM-DD format
     * @param  {Boolean} set  True if it is being focused, false otherwise.
     */
    toggleFocusWeek(date, set){
        var weekNumber = moment(date).format('W');
        this.setState({
            focusWeek: (set) ? weekNumber : null
        });
    },
    /**
     * Renders a week in the month.
     * @param  {Array} days  An array of MonthDay components.
     * @return {React.component}       A React component to be rendered.
     */
    renderWeek(days, index) {
        return <div key={index} className="cal-row-fluid cal-before-eventlist"
            onMouseEnter={this.toggleFocusWeek.bind(null, days[0].props.date, true)}
            onMouseLeave={this.toggleFocusWeek.bind(null, days[0].props.date, false)}>
                {days}
            </div>;
    },
    /**
     * @return {React.component} A calendar month to be rendered.
     */
    renderMonth() {
        let current = getFirst(moment(this.props.date, 'YYYY-MM-DD'));
        let end = getLast(moment(this.props.date, 'YYYY-MM-DD'));
        let weeks = [];

        while (current.isBefore(end)) {
            var focus = weeks.length % 7 === 0
                && current.format('W') === this.state.focusWeek;

            weeks.push(<MonthDay
                key={current.format('DD-MM')}
                date={current.format('YYYY-MM-DD')}
                viewMonth={this.props.date}
                focusWeek={focus}/>);

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
