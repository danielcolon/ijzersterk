import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import Agenda from '../models/Agenda.js';
import {
    Tooltip, OverlayTrigger
}
from 'react-bootstrap';
import _ from 'lodash';
import WeekBox from './WeekBox.jsx';
import DayTick from './DayTick.jsx';
import EventCircle from './EventCircle.jsx';
import EL from '../EventListener.js';

export
default React.createClass({
    getInitialState() {
        return {
            hover: false
        };
    },
    mouseOver() {
        this.setState({
            hover: true
        });
    },
    mouseLeave() {
        this.setState({
            hover: false
        });
    },
    renderEvent(event, index) {
        const tooltip = (<Tooltip>{event.title}</Tooltip>);
        return <OverlayTrigger
                    onMouseOver={EL.partialEmit('toggleFocusEvent', event, true)}
                    key={index}
                    placement='top'
                    overlay={tooltip}>
                <EventCircle
                    onMouseLeave={EL.partialEmit('toggleFocusEvent', event, false)}
                    event={event}/>
            </OverlayTrigger>;
    },
    getCSSClasses(date, events) {
        var monthMM = moment(this.props.viewMonth, 'YYYY-MM-DD');
        var focusEvent;

        if (this.props.focusEvent !== null) {
            focusEvent = _.find(events, {
                id: this.props.focusEvent
            });
        }

        var classes = classNames('cal-month-day', {
            'cal-day-inmonth': date.get('month') === monthMM.get('month'),
            'cal-day-outmonth': date.get('month') !== monthMM.get('month'),
            'cal-day-weekend': date.get('day') === 0 || date.get('day') === 6,
            'day-highlight': focusEvent !== undefined
        });

        if (focusEvent !== undefined) {
            var eventStyle = _.find(Agenda.types, {
                id: focusEvent.idEventType
            }).style;
            classes += ` dh-event-${eventStyle}`;
        }
        return classes;
    },
    render() {
        var events = Agenda.getEvents(this.props.date);
        return (
            <div className="cal-cell1 cal-cell" onMouseOver={this.mouseOver}
                onMouseLeave={this.mouseLeave} >
                <div className={this.getCSSClasses(this.props.date, events)} >
                    <span className="pull-right" data-cal-date=""
                        onClick={EL.partialEmit('toggleView', 'day', this.props.date)}>
                            {this.props.date.date()}
                    </span>
                    <WeekBox date={this.props.date} visible={this.props.focusWeek}/>
                    <div className="events-list">{events.map(this.renderEvent)}</div>
                    <DayTick onClick={EL.partialEmit('setFocusDay', this.props.date)}
                        visible={this.state.hover && events.length > 0}/>
                </div>
            </div>
        );
    }
});
