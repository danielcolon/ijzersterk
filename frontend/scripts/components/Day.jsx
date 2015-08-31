import React from 'react';
import Agenda from '../models/Agenda.js';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import EL from '../EventListener.js';

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
    return moment(event.start).isBefore(today, 'day')
    && moment(event.end).isAfter(today, 'day');
};

var isBeforeStart = function(today, event) {
    return moment(event.end).isBefore(today.clone().hours(START), 'hours');
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
                var style = _.find(Agenda.types, {
                    id: event.idEventType
                }).style;
                var classes = classNames('day-highlight', 'dh-event-' + style);

                return <div className="row-fluid clearfix cal-day-hour">
                    <div className="span1 col-xs-1">
                        <b>All day</b>
                    </div>
                    <div className="span11 col-xs-11">
                        <div className={classes}>
                            <a onClick={EL.partialEmit('openEvent', event.id)}
                                className="event-item">{event.title}</a>
                        </div>
                    </div>
                </div>;
            }
        },
        renderBefore(event, index) {
            if (isBeforeStart(this.props.date, event)) {
                var style = _.find(Agenda.types, {
                    id: event.idEventType
                }).style;
                var classes = classNames('day-highlight', 'dh-event-' + style);

                return <div key={index} className="row-fluid clearfix cal-day-hour">
                    <div className="span1 col-xs-1">
                        <b>Ends before timeline</b>
                    </div>
                    <div className="span11 col-xs-11">
                        <div className={classes}>
                            <span className="cal-hours pull-right">
                                {moment(event.end).format('HH:mm')}
                            </span>
                            <a onClick={EL.partialEmit('openEvent', event.id)}
                                className="event-item">{event.title}</a>
                        </div>
                    </div>
                </div>;
            }
        },
        renderEvent(event, index) {
            if (!isAllDay(this.props.date, event) && !isBeforeStart(this.props.date, event)) {
                var eventStyle = _.find(Agenda.types, {
                    id: event.idEventType
                }).style;
                var classes = classNames('pull-left', 'day-event', 'day-highlight', 'col-xs-3', 'dh-event-' + eventStyle);
                var startDay = this.props.date.clone().hour(START).minutes(0);
                var eventStart = moment(event.start);
                var eventEnd = moment(event.end);
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
                style.minHeight = style.height; // Needed for hover effect

                return <div key={index} className={classes} style={style}>
                    <span className="cal-hours">
                        {eventStart.format('D MMM HH:mm')}-
                        {eventEnd.format('HH:mm')}
                    </span><br/>
                    <a onClick={EL.partialEmit('openEvent', event.id)}
                                className="event-item">{event.title}</a>
                </div>;
            }
        },
        render() {
            var events = Agenda.getEvents(this.props.date);
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
                        </div>
                    </div>);
    }
});
