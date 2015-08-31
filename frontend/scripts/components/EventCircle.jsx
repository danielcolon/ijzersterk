import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Agenda from '../models/Agenda.js';

export default React.createClass({
    render(){
        var event = this.props.event;
        var style = _.find(Agenda.types, {
            id: event.idEventType
        }).style;

        var classes = classNames(this.props.className, 'pull-left', 'event', 'event-' + style);

        return <div {...this.props} className={classes}/>;
    }
});
