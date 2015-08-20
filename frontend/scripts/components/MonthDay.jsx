import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import AgendaEvents from '../models/AgendaEvents.js';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import _ from 'lodash';

export
default React.createClass({
    getInitialState(){
        return {
            hover: false
        };
    },
    mouseOver(){
        this.setState({
            hover: true
        });
    },
    mouseLeave(){
        this.setState({
            hover: false
        });
    },
    getEvents(){
        var date = moment(this.props.date, 'YYYY-MM-DD');
        return AgendaEvents.events.filter(function(event){
            return date.isBetween(event.startDate, event.endDate, 'day') ||
                date.isSame(event.startDate, 'day') ||
                date.isSame(event.endDate, 'day');
        });
    },
    /**
     * Creates a week box. Which shows which week is being focused.
     * @return {React.div}
     */
    renderWeekBox(){
        var date = moment(this.props.date, 'YYYY-MM-DD');
        return (<div id="cal-week-box" data-cal-week>Week {date.format('W')}</div>);
    },
    renderDayTick(){
        return (<div id="cal-day-tick">
                    <span className="glyphicon glyphicon-chevron-down"></span>
                </div>);
    },
    renderEvent(event, index){
        var tooltip = (<Tooltip>{event.title}</Tooltip>);
        var style = _.find(AgendaEvents.types, {
            type: event.type
        }).style;
        var classes = classNames('pull-left', 'event', 'event-' + style);

        return <OverlayTrigger key={index} placement='top'
                overlay={tooltip}>
                    <div data-event-class={'event-' + {style}} className={classes}>
                </div>
            </OverlayTrigger>;
    },
    render() {
        var date = moment(this.props.date, 'YYYY-MM-DD');
        var monthMM = moment(this.props.viewMonth, 'YYYY-MM-DD');

        var classes = classNames('cal-month-day', {
            'cal-day-inmonth': date.get('month') === monthMM.get('month'),
            'cal-day-outmonth': date.get('month') !== monthMM.get('month')
        }, {
            'cal-day-weekend': date.get('day') === 0 || date.get('day') === 6
        });
        return (
            <div className="cal-cell1 cal-cell" onMouseOver={this.mouseOver}
                onMouseLeave={this.mouseLeave}>
                <div className={classes} >
                    <span className="pull-right" data-cal-date>{date.date()}</span>
                    {this.props.focusWeek ? this.renderWeekBox() : null}
                    <div className="events-list">
                        {this.getEvents().map(this.renderEvent)}
                    </div>
                    {this.state.hover && this.getEvents().length > 0 ? this.renderDayTick() : null}
                </div>
            </div>
        );
    }
});
