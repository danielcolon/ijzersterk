/**
 * The starting point of the JavaScript in the website.
 */

import React from 'react';
import Router from 'react-router';
import Header from './views/Header.jsx';
import Footer from './views/Footer.jsx';
import Home from './views/Home.jsx';
import Blogs from './views/Blogs.jsx';
import Calendar from './components/Calendar.jsx';
import Newmember from './views/Newmember.jsx';
import About from './views/About.jsx';
import Login from './components/Login.jsx';

var { Route, RouteHandler, DefaultRoute } = Router;
window.React = React;

// The app component the root components of all other components.
var App = React.createClass({
    render(){
        return (<div>
                <Header/>
                <div className="container">
                    <div className="row">
                        <RouteHandler/>
                    </div>
                </div>
                <Footer/>
            </div>);
    }
});

// Defines the routes within the website.
// So going to domain.com/#/home will load the Home component.
var routes = (
    <Route path="/" handler={App}>
        <DefaultRoute handler={Home}/>
        <Route name="home" handler={Home}/>
        <Route name="blogs" handler={Blogs}/>
        <Route name="agenda" handler={Calendar}/>
        <Route name="newmember" handler={Newmember}/>
        <Route name="about" handler={About}/>
        <Route name="admin" handler={Login}/>
    </Route>
);

// Inject the routes into the root component.
Router.run(routes, function(Handler){
    React.render(<Handler/>, document.getElementById('react'));
});
