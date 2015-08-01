import React from 'react';
import moment from 'moment';
import Month from './Month.jsx';

export
default React.createClass({
    renderWeekCell(week){
        return <div className="cal-cell1">{week}</div>;
    },
    render() {
        return (
            <div className="cal-context" style={{width: '100%'}}>
                <div className="cal-row-fluid cal-row-head">
                    {moment.weekdays().map(this.renderWeekCell)}
                </div>
                <Month date="2015-07-31"></Month>
            </div>
        );
    }
});
