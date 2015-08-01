import React from 'react';

export
default React.createClass({
    render() {
        return (<div className="col-md-8 main">
                    <h1>DSKV IJzersterk</h1>
                    <span className="description">The student weightlifting association in Delft</span>
                    <div className="row main-img">
                        <img className="col-md-12"
                            src="http://www.ijzersterkdelft.nl/images/150322/20150322-171822.jpg"/>
                    </div>
                    <p>
                        <span className="emp-red">Strong together</span>, that is our motto. We lift together, we yell at each other and we motivate each other to achieve that summer body physique, or to achieve that personal record on the squat or just to become healthy.
                    </p>
                    <p>At DSKV IJzersterk you can find other people who are interested in eating and becoming healthy, powerlifting, olympic lifting and strongman. People whom you can ask for guidance or just to train with. Interested? Look at the <a href="newmember.html">new member</a> page to find out how you can join!
                    </p>
                </div>);

    }
});