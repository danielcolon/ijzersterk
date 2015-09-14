import React from 'react';
import {
    Link
}
from 'react-router';

export
default React.createClass({
    render() {
        return (<div className="col-md-3 col-xs-12 sidebar">
            <div className="block">
                <h4>News</h4>
                <ul>
                    <li><Link to="/blogs#clinic-2015">IJzersterk Clinic</Link></li>
                    <li><Link to="/blogs#website-live">New website is finally live</Link></li>
                    <li><Link to="/blogs#newsletter2">Newsletter #2</Link></li>
                </ul>
            </div>
            <div className="block">
                <h4>Blogs</h4>
                <ul>
                    <li>
                        <Link to="/blogs#first-meet-joey">My first powerlifting meet - by Joey</Link>
                    </li>
                    <li>
                        <Link to="/blogs#ego-lifting">
                            Ego lifting - The good, the bad and the ugly
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="block">
                <h4>Agenda</h4>
                <span className="soon">Coming soon</span>
            </div>
        </div>);
    }
});
