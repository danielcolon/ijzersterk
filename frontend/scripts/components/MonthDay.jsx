import React from 'react';
import moment from 'moment';
import classNames from 'classnames';

export
default React.createClass({
    /**
     * Creates a week box. Which shows which week is being focused.
     * @return {React.div}
     */
    renderWeekBox(){
        var mm = moment(this.props.date, 'YYYY-MM-DD');

        return <div id="cal-week-box" data-cal-week>Week {mm.format('W')}</div>;
    },
    render() {
        var mm = moment(this.props.date, 'YYYY-MM-DD');
        var monthMM = moment(this.props.viewMonth, 'YYYY-MM-DD');
        var classes = classNames('cal-month-day', {
            'cal-day-inmonth': mm.get('month') === monthMM.get('month'),
            'cal-day-outmonth': mm.get('month') !== monthMM.get('month')
        }, {
            'cal-day-weekend': mm.get('day') === 0 || mm.get('day') === 6
        });
        return (
            <div className="cal-cell1 cal-cell">
                <div className={classes}>
                    <span className="pull-right" data-cal-date>{mm.date()}</span>
                    {this.props.focusWeek ? this.renderWeekBox() : null}
                </div>
            </div>
        );
    }
});
