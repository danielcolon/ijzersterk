import React from 'react';
import {Input} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default React.createClass({
    render(){
        var event = this.props.event;
        var addonTime = <i className="fa fa-clock-o"></i>;
        return (<form className="form-horizontal">
            <Input type="text"
                defaultValue={event.title}
                label="Title"
                labelClassName='col-xs-3'
                wrapperClassName='col-xs-9'/>
            <Input type="textarea"
                defaultValue={event.description}
                label="Description"
                labelClassName='col-xs-3'
                wrapperClassName='col-xs-9'/>
            <Input type="select"
                label="Type of event"
                labelClassName='col-xs-3'
                wrapperClassName='col-xs-9'>
                <option value="training">training</option>
            </Input>
            <Input type='checkbox'
                label='Register possible'
                wrapperClassName='col-xs-offset-3 col-xs-9'/>
            <div className="form-group">
                <label className="control-label col-xs-3">
                    <span>Start</span>
                </label>
                <div className="col-xs-4">
                    <div className="input-group ">
                        <DatePicker dateFormat="DD-MM-YYYY"
                            minDate={moment()}
                            selected={moment(event.start)}
                            className="form-control col-xs-9"/>
                        <span className="input-group-addon">
                            <i className="fa fa-calendar"></i>
                        </span>
                    </div>
                </div>
                <Input type='text'
                    wrapperClassName='col-xs-3'
                    defaultValue={moment(event.start).format('HH:mm')}
                    addonAfter={addonTime}/>
            </div>
            <div className="form-group">
                <label className="control-label col-xs-3">
                    <span>End</span>
                </label>
                <div className="col-xs-4">
                    <div className="input-group ">
                        <DatePicker dateFormat="DD-MM-YYYY"
                            minDate={moment(event.start)}
                            selected={moment(event.end)}
                            className="form-control col-xs-9"/>
                        <span className="input-group-addon">
                            <i className="fa fa-calendar"></i>
                        </span>
                    </div>
                </div>
                <Input type='text'
                    wrapperClassName='col-xs-3'
                    defaultValue={moment(event.end).format('HH:mm')}
                    addonAfter={addonTime}/>
            </div>
        </form>);
    }
});
