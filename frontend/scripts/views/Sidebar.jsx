import React from 'react';
import {
    Link
}
from 'react-router';

export
default React.createClass({
    shouldComponentUpdate() {
        return false;
    },
    render() {
        return (<div className="col-md-3 col-xs-12 sidebar">
            <div className="block">
                <h4>News</h4>
                <ul>
                    <li><Link to="blogs">New website is finally live</Link></li>
                    <li><Link to="blogs">Newsletter #2</Link></li>
                    <li><Link to="blogs">Sterkste Student(e) van Delft</Link></li>
                </ul>
            </div>
            <div className="block">
                <h4>Blogs</h4>
                <span className="soon">Coming soon</span>
            </div>
            <div className="block">
                <h4>Agenda</h4>
                <span className="soon">Coming soon</span>
            </div>
        </div>);
    }
});
