import React from 'react';
import EventCircle from './EventCircle.jsx';

export
default React.createClass({
    renderEvent(event, index) {
        return (<li key={index}>
                    <EventCircle event={event}/>&nbsp;
                    <a href="#" data-event-id
                        onMouseOver={this.props.toggleFocusEvent.bind(null, event, true)}
                        onMouseLeave={this.props.toggleFocusEvent.bind(null, event, false)}
                        className="event-item">
                        {event.title}
                    </a>
                </li>);
    },
    render() {
        var tickDay = 'tick-day' + (this.props.dayIndex + 1);
        return (
            <div id="cal-slide-box" key="cal-slide">
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
