import React from 'react';
import moment from 'moment';
import Month from './Month.jsx';
import Day from './Day.jsx';
import CalendarControls from './CalendarControls.jsx';
import EventModal from './EventModal.jsx';
import EventListener from '../EventListener.js';

export
default React.createClass({
    getInitialState() {
        return {
            date: moment(),
            view: 'month',
            showEventModal: false,
            eventId: null
        };
    },
    componentDidMount(){
        var onEvents = ['openEvent', 'closeEvent', 'prev', 'next', 'reset', 'toggleView'];
        var $self = this;
        onEvents.map(function(onEvent){
            EventListener.on(onEvent, $self[onEvent]);
        });
    },
    openEvent(id){
        this.setState({
            showEventModal: true,
            eventId: id
        });
    },
    closeEvent(){
        this.setState({
            showEventModal: false,
            eventId: null
        });
    },
    prev() {
        this.setState({
            date: this.state.date.add(-1, this.state.view)
        });
    },
    next() {
        this.setState({
            date: this.state.date.add(1, this.state.view)
        });
    },
    reset() {
        this.setState({
            date: moment()
        });
    },
    toggleView(view, date) {
        this.setState({
            view: view,
            date: date
        });
    },
    renderView() {
        if (this.state.view === 'month') {
            return <Month key={2} date={this.state.date}></Month>;
        } else if (this.state.view === 'day') {
            return <Day key={2} date={this.state.date}></Day>;
        }
    },
    renderDate() {
        if (this.state.view === 'month') {
            return this.state.date.format('MMMM YYYY');
        }
        return this.state.date.format('dddd DD MMMM, YYYY');
    },
    render() {
        return (
            <div id="calendar">
                <div className="page-header">
                    <CalendarControls className="pull-right form-inline" view={this.state.view}
                        date={this.state.date}/>
                    <h3>{this.renderDate()}</h3>
                </div>
                <div className="cal-context">
                    {this.renderView()}
                </div>
                <EventModal event={this.state.eventId} show={this.state.showEventModal}
                    onHide={this.closeEvent}/>
            </div>
        );
    }
});
