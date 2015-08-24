import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import AgendaEvents from '../models/AgendaEvents.js';
import {
    Tooltip, OverlayTrigger
}
from 'react-bootstrap';
import _ from 'lodash';

export
default React.createClass({
    getInitialState() {
        return {
            hover: false
        };
    },
    onClick() {
        this.props.onDayClick(this.props.date);
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
    /**
     * Creates a week box. Which shows which week is being focused.
     * @return {React.div}
     */
    renderWeekBox() {
        return (<div id="cal-week-box" data-cal-week="">Week {this.props.date.format('W')}</div>);
    },
    renderDayTick() {
        return (<div id="cal-day-tick">
                    <span className="glyphicon glyphicon-chevron-down"></span>
                </div>);
    },
    renderEvent(event, index) {
        var tooltip = (<Tooltip>{event.title}</Tooltip>);
        var style = _.find(AgendaEvents.types, {
            type: event.type
        }).style;
        var classes = classNames('pull-left', 'event', 'event-' + style);

        return <OverlayTrigger key={index} placement='top'
                overlay={tooltip}
                onMouseOver={this.props.toggleFocusEvent.bind(null, event, true)}>
                    <div onMouseLeave={this.props.toggleFocusEvent.bind(null, event, false)}
                         data-event-class={'event-' + {style}}
                         className={classes}>
                    </div>
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
            var eventStyle = _.find(AgendaEvents.types, {
                type: focusEvent.type
            }).style;
            classes += ` dh-event-${eventStyle}`;
        }
        return classes;
    },
    render() {
        var events = AgendaEvents.getEvents(this.props.date);
        return (
            <div className="cal-cell1 cal-cell" onMouseOver={this.mouseOver}
                onMouseLeave={this.mouseLeave} onClick={this.onClick}>
                <div className={this.getCSSClasses(this.props.date, events)} >
                    <span className="pull-right" data-cal-date>{this.props.date.date()}</span>
                    {this.props.focusWeek ? this.renderWeekBox() : null}
                    <div className="events-list">
                        {events.map(this.renderEvent)}
                    </div>
                    {this.state.hover && events.length > 0 ? this.renderDayTick() : null}
                </div>
            </div>
        );
    }
});
