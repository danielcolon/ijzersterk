import React from 'react/addons';
import moment from 'moment';
import MonthDay from './MonthDay.jsx';
import _ from 'lodash';
import AgendaEvents from '../models/AgendaEvents.js';
import classNames from 'classnames';

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
            focusWeek: null,
            focusDay: null,
            focusEvent: null
        };
    },
    /**
     * Invoked when clicked on a day.
     * Sets the focusDay state to that day if not already set, otherwise null.
     * @param  {String} date The date which was clicked on in YYYY-MM-DD format.
     */
    onDayClick(date){
        var events = AgendaEvents.getEvents(date);
        if (events.length === 0 ||
            (this.state.focusDay !== null && this.state.focusDay.isSame(date, 'day'))) {
            this.setState({
                focusDay: null
            });
        } else {
            this.setState({
                focusDay: date
            });
        }
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
    toggleFocusEvent(event, set){
        this.setState({
            focusEvent: (set) ? event.id : null
        });
    },
    /**
     * Renders the slide box when clicking on a day.
     * @param  {Number} dayIndex The n-th day that was on clicked.
     * @param  {Array} events   The array of events for that day.
     * @return {React.component} A cal-slide-box div.
     */
    renderSlideBox(dayIndex, events){
        var $self = this;

        var renderEvent = function(event, index){
            var style = _.find(AgendaEvents.types, {
                type: event.type
            }).style;
            var classes = classNames('pull-left', 'event', 'event-' + style);

            return (<li key={index}>
                        <span className={classes}></span>&nbsp;
                        <a href="#" data-event-id
                        onMouseOver={$self.toggleFocusEvent.bind(null, event, true)}
                        onMouseLeave={$self.toggleFocusEvent.bind(null, event, false)}
                            data-event-class={'event-' + style} className="event-item">
                            {event.title}
                        </a>
                    </li>);
        };

        var tickDay = 'tick-day' + (dayIndex + 1);
        return (
                <div id="cal-slide-box" key="cal-slide">
                    <span id="cal-slide-tick" className={tickDay}></span>
                    <div id="cal-slide-content" className="cal-event-list">
                        <ul className="unstyled list-unstyled">
                            {events.map(renderEvent)}
                        </ul>
                    </div>
                </div>
        );
    },
    /**
     * Renders a week in the month.
     * @param  {Array} days  An array of MonthDay components.
     * @return {React.component}       A React component to be rendered.
     */
    renderWeek(days, index) {
        var slideBox = null;
        if (this.state.focusDay !== null) {
            var $self = this;
            var dayIndex = _.findIndex(days, function(day) {
                return day.props.date.isSame($self.state.focusDay, 'day');
            });

            if (dayIndex !== -1) {
                var events = AgendaEvents.getEvents(this.state.focusDay, 'YYYY-MM-DD');
                slideBox = this.renderSlideBox(dayIndex, events);
            }
        }
        return (
                <div key={index}>
                    <div className="cal-row-fluid cal-before-eventlist"
                    onMouseEnter={this.toggleFocusWeek.bind(null, days[0].props.date, true)}
                    onMouseLeave={this.toggleFocusWeek.bind(null, days[0].props.date, false)}>
                        {days}
                    </div>
                    {slideBox}
                </div>);

    },
    /**
     * @return {React.component} A calendar month to be rendered.
     */
    renderMonth() {
        let current = getFirst(this.props.date.clone());
        let end = getLast(this.props.date.clone());
        let weeks = [];
        while (current.isBefore(end)) {
            var focus = weeks.length % 7 === 0
                && current.format('W') === this.state.focusWeek;

            weeks.push(<MonthDay
                key={current.format('DD-MM')}
                date={current.clone()}
                viewMonth={this.props.date}
                focusWeek={focus}
                focusEvent={this.state.focusEvent}
                onDayClick={this.onDayClick}
                toggleFocusEvent={this.toggleFocusEvent}
                />);

            current.add(1, 'day');
        }

        return _(weeks)
            .chunk(7)
            .map(this.renderWeek)
            .value();
    },
    renderWeekCell(week, index){
        return <div key={index} className="cal-cell1">{week}</div>;
    },
    render() {
        return <div>
                <div key={1} className="cal-row-fluid cal-row-head">
                    {moment.weekdays().map(this.renderWeekCell)}
                </div>
                <div className="cal-month-box">{this.renderMonth()}</div>
            </div>;
    }
});
