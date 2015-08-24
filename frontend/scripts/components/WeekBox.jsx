import React from 'react';

export
default React.createClass({
    render() {
        if (this.props.visible) {
            return <div id="cal-week-box" data-cal-week="">Week {this.props.date.format('W')}</div>;
        }
        return null;
    }
});
