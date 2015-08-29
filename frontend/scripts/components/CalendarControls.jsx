import _ from 'lodash';
import React from 'react';
import {ButtonGroup, Button} from 'react-bootstrap';

export default React.createClass({
    render(){
        return <div {...this.props} >
                    <ButtonGroup>
                        <Button bsStyle="primary" onClick={this.props.prev}>&lt;&lt; Prev</Button>
                        <Button onClick={this.props.reset}>Today</Button>
                        <Button bsStyle="primary" onClick={this.props.next}>Next &gt;&gt;</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button bsStyle="warning" active={this.props.view === 'month'}
                            onClick={_.partial(this.props.toggleView, 'month', this.props.date)}>
                                Month
                        </Button>
                        <Button bsStyle="warning" active={this.props.view === 'day'}
                            onClick={_.partial(this.props.toggleView, 'day', this.props.date)}>
                            Day
                        </Button>
                    </ButtonGroup>
                </div>;
    }
});
