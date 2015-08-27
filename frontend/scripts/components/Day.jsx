import React from 'react';

const hours = [];
for (var hour = 7; hour <= 23; hour++) {
    if (hour < 10) {
        hours.push([`0${hour}:00`, `0${hour}:30`]);
    } else {
        hours.push([`${hour}:00`, `${hour}:30`]);
    }
}

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
    render() {
        return (<div id="cal-day-box">
                    <div className="row-fluid clearfix cal-row-head">
                        <div className="span1 col-xs-1 cal-cell">Time</div>
                        <div className="span11 col-xs-11 cal-cell">Events</div>
                    </div>
                    <div id="cal-day-panel" className="clearfix"
                        style={{height: hours.length * 30 * 2 + 'px'}}>
                        <div id="cal-day-panel-hour">
                            {hours.map(this.renderHour)}
                        </div>
                    </div>
                </div>);
    }
});
