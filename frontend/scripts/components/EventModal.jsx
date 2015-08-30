import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import Agenda from '../models/Agenda.js';

export default React.createClass({
    componentWillMount(){
        var eventId = this.props.eventId;
    },
    render(){
        return <Modal {...this.props}>
                <Modal.Header closeButton>
                    <Modal.Title>test</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    asldfjas
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>;
    }
});
