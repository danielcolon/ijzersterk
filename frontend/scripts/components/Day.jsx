import React from 'react';
import AgendaEvents from '../models/AgendaEvents.js';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';

const START = 7;
const HEIGHT = 30; //each line is 30 pixels
const END = 23.5;


var generateHours = function() {
    const hours = [];
    for (var hour = START; hour <= END; hour++) {
        if (hour < 10) {
            hours.push([`0${hour}:00`, `0${hour}:30`]);
        } else {
            hours.push([`${hour}:00`, `${hour}:30`]);
        }
    }
    return hours;
};

var isAllDay = function(today, event) {
    return moment(event.startDate).isBefore(today, 'day') && moment(event.endDate).isAfter(today, 'day');
};

var isBeforeStart = function(today, event) {
    return moment(event.endDate).diff(today.clone().hours(START), 'hours') < 0;
};

export
default React.createClass({
        renderHour(hour, index) {
            return <div key={index} className="cal-day-hour">
                    <div className="row-fluid cal-day-hour-part">
                        <div className="span1 col-xs-1">
                            <b>{hour[0]}</b>
                        </div>
                    </div>
                    <div className="row-fluid cal-day-hour-part">
                        <div className="span1 col-xs-1">
                            <b>{hour[1]}</b>
                        </div>
                    </div>
                </div>;
        },
        renderAllDay(event) {
            if (isAllDay(this.props.date, event)) {
                var style = _.find(AgendaEvents.types, {
                    type: event.type
                }).style;
                var classes = classNames('day-highlight', 'dh-event-' + style);

                return <div className="row-fluid clearfix cal-day-hour">
                    <div className="span1 col-xs-1">
                        <b>All day</b>
                    </div>
                    <div className="span11 col-xs-11">
                        <div className={classes}>
                            <a href="#" className="event-item">{event.title}</a>
                        </div>
                    </div>
                </div>;
            }
        },
        renderBefore(event) {
            if (isBeforeStart(this.props.date, event)) {
                var style = _.find(AgendaEvents.types, {
                    type: event.type
                }).style;
                var classes = classNames('day-highlight', 'dh-event-' + style);

                return <div className="row-fluid clearfix cal-day-hour">
                    <div className="span1 col-xs-1">
                        <b>Ends before timeline</b>
                    </div>
                    <div className="span11 col-xs-11">
                        <div className={classes}>
                            <span className="cal-hours pull-right">
                                {moment(event.endDate).format('HH:mm')}
                            </span>
                            <a href="#" className="event-item">{event.title}</a>
                        </div>
                    </div>
                </div>;
            }
        },
        renderEvent(event, index) {
            if (!isAllDay(this.props.date, event) && !isBeforeStart(this.props.date, event)) {
                var eventStyle = _.find(AgendaEvents.types, {
                    type: event.type
                }).style;
                var classes = classNames('pull-left', 'day-event', 'day-highlight', 'dh-event-' + eventStyle);
                var startDay = this.props.date.clone().hour(START).minutes(0);
                var eventStart = moment(event.startDate);
                var eventEnd = moment(event.endDate);
                var style = {
                    marginTop: 0,
                    height: 'auto'
                };

                if (eventStart.diff(startDay, 'minutes') > 0) {
                    style.marginTop = eventStart.diff(startDay, 'minutes') / 30 * HEIGHT;
                    style.height = eventEnd.diff(eventStart, 'minutes') / 30 * HEIGHT;
                } else {
                    style.height = eventEnd.diff(startDay, 'minutes') / 30 * HEIGHT;
                }
                style.height = Math.min(generateHours().length * HEIGHT * 2 - style.marginTop,
                    style.height);

                return <div key={index} className={classes} style={style}>
                    <span className="cal-hours">
                        {eventStart.format('DD MMM HH:mm')}-
                        {eventEnd.format('HH:mm')}
                    </span>
                    {event.title}<br/>
                    {event.description}<br/>
                    <ul>
                        {event.attendees.map(function(attendee, liIndex){
                            return <li key={liIndex}>{attendee.name}</li>;
                        })}
                    </ul>
                </div>;
            }
        },
        render() {
            var events = AgendaEvents.getEvents(this.props.date);
            return (<div id="cal-day-box">
                        <div className="row-fluid clearfix cal-row-head">
                            <div className="span1 col-xs-1 cal-cell">Time</div>
                            <div className="span11 col-xs-11 cal-cell">Events</div>
                        </div>
                        {(events).map(this.renderAllDay).filter(Boolean)}
                        {(events).map(this.renderBefore).filter(Boolean)}
                        <div id="cal-day-panel" className="clearfix"
                            style={{height: generateHours().length * HEIGHT * 2 + 'px'}}>
                            <div id="cal-day-panel-hour">
                                {generateHours().map(this.renderHour)}
                            </div>
                            {events.map(this.renderEvent)}
                        </div> < /div>);
    }
});
