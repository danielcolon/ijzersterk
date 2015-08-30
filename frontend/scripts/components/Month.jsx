import React from 'react/addons';
import moment from 'moment';
import MonthDay from './MonthDay.jsx';
import _ from 'lodash';
import Agenda from '../models/Agenda.js';
import SlideBox from './SlideBox.jsx';
import {Collapse} from 'react-bootstrap';
import EL from '../EventListener.js';

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
    componentDidMount(){
        var onEvents = ['toggleFocusEvent', 'setFocusDay', 'toggleFocusWeek'];
        var $self = this;
        onEvents.map(function(event){
            EL.on(event, $self[event]);
        });
    },
    /**
     * Invoked when clicked on a day.
     * Sets the focusDay state to that day if not already set, otherwise null.
     * @param  {String} date The date which was clicked on in YYYY-MM-DD format.
     */
    setFocusDay(date){
        var events = Agenda.getEvents(date);
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
     * Renders a week in the month.
     * @param  {Array} days  An array of MonthDay components.
     * @return {React.component}       A React component to be rendered.
     */
    renderWeek(days, index) {
        var slideBoxIndex = -1;
        var events = [];
        if (this.state.focusDay !== null) {
            var $self = this;
            slideBoxIndex = _.findIndex(days, function(day) {
                return day.props.date.isSame($self.state.focusDay, 'day');
            });
            events = Agenda.getEvents(this.state.focusDay, 'YYYY-MM-DD');
        }

        return (
                <div key={index}>
                    <div className="cal-row-fluid cal-before-eventlist"
                    onMouseEnter={EL.partialEmit('toggleFocusWeek', days[0].props.date, true)}
                    onMouseLeave={EL.partialEmit('toggleFocusWeek', days[0].props.date, false)}>
                        {days}
                    </div>
                    <Collapse in={slideBoxIndex !== -1}>
                        <SlideBox events={events} dayIndex={slideBoxIndex}/>
                    </Collapse>
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
