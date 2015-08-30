import React from 'react';
import {ButtonGroup, Button} from 'react-bootstrap';
import EL from '../EventListener.js';

export default React.createClass({
    render(){
        return (<div {...this.props}>
                <ButtonGroup>
                    <Button bsStyle="success" onClick={EL.partialEmit('openEvent', 'new')}>
                        <i className="fa fa-plus"></i>
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button bsStyle="primary" onClick={EL.partialEmit('prev')}>&lt;&lt; Prev</Button>
                    <Button onClick={EL.partialEmit('reset')}>Today</Button>
                    <Button bsStyle="primary" onClick={EL.partialEmit('next')}>Next &gt;&gt;</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button bsStyle="warning" active={this.props.view === 'month'}
                        onClick={EL.partialEmit('toggleView', 'month', this.props.date)}>
                            Month
                    </Button>
                    <Button bsStyle="warning" active={this.props.view === 'day'}
                        onClick={EL.partialEmit('toggleView', 'day', this.props.date)}>
                        Day
                    </Button>
                </ButtonGroup>
            </div>);
    }
});
