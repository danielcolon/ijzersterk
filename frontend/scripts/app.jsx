/**
 * The starting point of the JavaScript in the website.
 */

import React from 'react';
import Router from 'react-router';
import Header from './views/Header.jsx';
import Footer from './views/Footer.jsx';
import Home from './views/Home.jsx';
import Blogs from './views/Blogs.jsx';
import Newmember from './views/Newmember.jsx';
import About from './views/About.jsx';
import Login from './components/Login.jsx';

var {
    Route, RouteHandler, DefaultRoute, NotFoundRoute
} = Router;
window.React = React;

// The app component the root components of all other components.
var App = React.createClass({
    render() {
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

var UnderConstruction = React.createClass({
    render() {
        return <h1>UNDER CONSTRUCTION</h1>;
    }
});

// Defines the routes within the website.
// So going to domain.com/#/home will load the Home component.
var routes = (
    <Route path="/" handler={App}>
        <DefaultRoute name="home" handler={Home}/>
        <NotFoundRoute handler={Home}/>
        <Route name="blogs" handler={Blogs}/>
        <Route name="agenda" handler={UnderConstruction}/>
        <Route name="newmember" handler={Newmember}/>
        <Route name="about" handler={About}/>
        <Route name="admin" handler={Login}/>
    </Route>
);

// Set the options for the router
var router = Router.create({
    routes: routes,
    location: Router.HashLocation,
    scrollBehavior: {
        /**
         * Sets the behaviour for scrolling when changing state.
         * If there is a second hash in the url, scroll to the element with matching identifier.
         * Otherwise scroll to the top.
         * @override
         */
        updateScrollPosition: function updateScrollPosition() {
            window.location.hash = window.decodeURIComponent(window.location.hash);
            const hashParts = window.location.hash.split('#');
            if (hashParts.length > 2) {
                const hash = hashParts.slice(-1)[0];
                const element = document.querySelector(`#${hash}`);
                if (element) {
                    element.scrollIntoView();
                }
            } else {
                window.scrollTo(0, 0);
            }
        }
    }
});

router.run(function(Handler) {
    React.render(<Handler/>, document.getElementById('react'));
});
