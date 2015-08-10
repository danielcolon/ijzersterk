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
            <div>
                <h1>UNDER CONSTRUCTION</h1>
                <div className="page-header">
                    <span className="pull-right form-inline">
                        <div className="btn-group">
                            <button className="btn btn-primary">&lt;&lt; Prev</button>
                            <button className="btn btn-primary">Today</button>
                            <button className="btn btn-primary">Next &gt;&gt;</button>
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-warning active">Month</button>
                            <button className="btn btn-warning">Day</button>
                        </div>
                    </span>
                    <h3>{moment().format('MMMM YYYY')}</h3>

                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="cal-context" style={{width: '100%'}}>
                            <div className="cal-row-fluid cal-row-head">
                                {moment.weekdays().map(this.renderWeekCell)}
                            </div>
                            <Month date="2015-07-31"></Month>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
