import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import AgendaEvents from '../models/AgendaEvents.js';

export default React.createClass({
    render(){
        var event = this.props.event;
        var style = _.find(AgendaEvents.types, {
            type: event.type
        }).style;

        var classes = classNames(this.props.className, 'pull-left', 'event', 'event-' + style);

        return <div {...this.props} className={classes}/>;
    }
});
