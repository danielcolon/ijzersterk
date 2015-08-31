import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import Agenda from '../models/Agenda.js';
import moment from 'moment';
import EL from '../EventListener.js';

export default React.createClass({
    getInitialState(){
        return Agenda.getEvent(this.props.eventId);
    },
    componentWillReceiveProps(nextProps){
        this.setState(Agenda.getEvent(nextProps.eventId));
    },
    leave(){
        Agenda.leave(this.state);
        this.setState(Agenda.getEvent(this.props.eventId));
    },
    attend(){
        Agenda.attend(this.state);
        this.setState(Agenda.getEvent(this.props.eventId));
    },
    render(){
        var event = this.state;
        var startDate = moment(event.start);
        var endDate = moment(event.end);
        return <Modal {...this.props}>
                <Modal.Header closeButton>
                    <Modal.Title>{event.title} - {startDate.format('D MMM HH:mm')} <span> till </span>
                    {(endDate.isSame(startDate, 'day')) ?
                        endDate.format('HH:mm') : endDate.format('D MMM HH:mm')} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {event.description}<br/>
                    Attendees:
                    <ul>
                        {(event.subscribed.length > 0) ?
                            event.subscribed.map(function(attendee, index){
                                return <li key={index}>{attendee}</li>;
                            }) : <i>None, be the first to register!</i>
                        }
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    {(Agenda.isAttending(event)) ?
                        <Button onClick={this.leave} bsStyle="danger">Leave</Button> :
                        <Button onClick={this.attend} bsStyle="success">Attend</Button>}
                    <Button onClick={EL.partialEmit('editEvent', event.id)} style={{
                        display: (Agenda.canEdit(event)) ? 'initial' : 'none'}}>Edit</Button>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>;
    }
});
