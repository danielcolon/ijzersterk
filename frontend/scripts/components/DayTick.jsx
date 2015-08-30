import React from 'react';

export
default React.createClass({
    render() {
        if (this.props.visible) {
            return <div {...this.props} id="cal-day-tick">
                    <span className="glyphicon glyphicon-chevron-down"></span>
                </div>;
        }
        return null;
    }
});
