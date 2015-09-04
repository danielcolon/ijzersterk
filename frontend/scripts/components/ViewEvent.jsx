import React from 'react';

export default React.createClass({
    render(){
        var event = this.props.event;
        return (<div>{event.description}<br/>
                    Attendees:
                    <ul>
                        {(event.subscribed.length > 0) ?
                            event.subscribed.map(function(attendee, index){
                                return <li key={index}>{attendee}</li>;
                            }) : <i>None, be the first to register!</i>
                        }
                    </ul>
                </div>);
    }
});
