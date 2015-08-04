import React from 'react';
import moment from 'moment';

export
default React.createClass({
    render() {
        var mm = moment(this.props.date, 'YYYY-MM-DD');
        return (
            <div className="cal-cell1 cal-cell">
                <div className="cal-month-day cal-day-inmonth">
                    <span className="pull-right">{mm.date()}</span>
                </div>
            </div>
        );
    }
});
