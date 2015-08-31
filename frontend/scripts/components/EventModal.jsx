import React from 'react';
import {Modal, Button, ButtonGroup} from 'react-bootstrap';
import Agenda from '../models/Agenda.js';
import moment from 'moment';
import EL from '../EventListener.js';

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    refresh(eventId){
        eventId = (eventId !== undefined && eventId !== null) ? eventId : this.props.eventId;
        this.setState({
            model: Agenda.getEvent(eventId)
        });
    },
    getInitialState(){
        return {
            view: 'edit',
            model: Agenda.getEvent(this.props.eventId)
        };
    },
    componentWillMount(){
        EL.on('event.changed', () => this.refresh());
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            view: (nextProps.eventId === 'new') ? 'edit' : 'view'
        });
        this.refresh(nextProps.eventId);
    },
    viewMode(){
        this.setState({
            view: 'view'
        });
    },
    editMode(){
        this.setState({
            view: 'edit'
        });
    },
    renderView(){
        var event = this.state.model;
        return <Modal.Body>
                    {event.description}<br/>
                    Attendees:
                    <ul>
                        {(event.subscribed.length > 0) ?
                            event.subscribed.map(function(attendee, index){
                                return <li key={index}>{attendee}</li>;
                            }) : <i>None, be the first to register!</i>
                        }
                    </ul>
                </Modal.Body>;
    },
    renderEdit(){
        return <Modal.Body></Modal.Body>;
    },
    save(){

    },
    renderEditShow(){
        var save = <Button key={1} onClick={this.save} bsStyle="success">Save</Button>;
        var cancel = <Button key={2} onClick={this.viewMode}>Cancel</Button>;
        var edit = <Button key={3} onClick={this.editMode}>Edit</Button>;
        var attend = <Button key={4} onClick={()=> Agenda.attend(this.state.model)} bsStyle="success">Attend</Button>;
        var leave = <Button key={5} onClick={()=> Agenda.leave(this.state.model)} bsStyle="danger">Leave</Button>;
        var close = <Button key={6} onClick={this.props.onHide}>Close</Button>;
        var buttons = [];

        if (this.state.view === 'edit') {
            buttons.push(save, cancel);
        } else {
            if (Agenda.isAttending(this.state.model)){
                buttons.push(leave);
            } else {
                buttons.push(attend);
            }
            if (Agenda.canEdit(this.state.model)){
                buttons.push(edit);
            }
        }
        buttons.push(close);

        return <ButtonGroup>{buttons}</ButtonGroup>;
    },
    render(){
        var event = this.state.model;
        var startDate = moment(event.start);
        var endDate = moment(event.end);
        return <Modal {...this.props}>
                <Modal.Header closeButton>
                    <Modal.Title>{event.title} - {startDate.format('D MMM HH:mm')} <span> till </span>
                    {(endDate.isSame(startDate, 'day')) ?
                        endDate.format('HH:mm') : endDate.format('D MMM HH:mm')} </Modal.Title>
                </Modal.Header>
                {(this.state.view === 'edit') ? this.renderEdit() : this.renderView()}
                <Modal.Footer>
                    {this.renderEditShow()}
                </Modal.Footer>
            </Modal>;
    }
});
