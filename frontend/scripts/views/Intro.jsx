import React from 'react';
import {Link} from 'react-router';

export
default React.createClass({
    render() {
        return (<div className="col-md-7 col-md-offset-1 main">
                    <h1>DSKV IJzersterk</h1>
                    <span className="description">The Delft student strength-sport association</span>
                    <div className="row">
                        <img className="col-md-12 col-xs-12"
                            src="http://www.ijzersterkdelft.nl/images/150322/20150322-171822.jpg"/>
                    </div>
                    <p>
                        <span className="emp-red">Strong together</span>, that is our motto. We lift together, we yell at each other and we motivate each other to achieve that personal record on the squat, push ourselves just a little harder or just to become healthy.
                    </p>
                    <p>At DSKV IJzersterk you can find other people who are interested in: eating and becoming healthy, powerlifting, olympic lifting and or strongman. People whom you can ask for guidance or just to train with. Interested? Look at the <Link to="newmember">new member</Link> page to find out how you can join!
                    </p>
                </div>);
    }
});
