import React from 'react';
import EventCircle from './EventCircle.jsx';
import EL from '../EventListener.js';

export
default React.createClass({
    renderEvent(event, index) {
        return (
            <li key={index}>
                <EventCircle event={event}/>&nbsp;
                <a href="#" data-event-id
                    onMouseOver={EL.partialEmit('toggleFocusEvent', event, true)}
                    onMouseLeave={EL.partialEmit('toggleFocusEvent', event, true)}
                    className="event-item">
                    {event.title}
                </a>
            </li>
        );
    },
    render() {
        var tickDay = 'tick-day' + (this.props.dayIndex + 1);
        return (
            <div {...this.props} id="cal-slide-box" key="cal-slide">
                <span id="cal-slide-tick" className={tickDay}></span>
                <div id="cal-slide-content" className="cal-event-list">
                    <ul className="unstyled list-unstyled">
                        {this.props.events.map(this.renderEvent)}
                    </ul>
                </div>
            </div>
        );
    }
});
