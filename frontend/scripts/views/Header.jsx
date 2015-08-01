import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
    render(){
        return (<nav className="navbar navbar-inverse clearfix">
          <div className="container">
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav left">
                <li><Link to="/">Home</Link></li>
                <li><Link to="blogs">Blogs</Link></li>
                <li><Link to="agenda">Agenda</Link></li>
              </ul>
              <ul className="nav navbar-nav pull-right">
                <li><Link to="newmember">New member</Link></li>
                <li><Link to="about">About</Link></li>
                <li><a href="http://wiki.ijzersterkdelft.nl/index.php/Hoofdpagina">Wiki</a></li>
              </ul>
            </div>
            <Link to="home"><div className="logo"></div></Link>
          </div>
        </nav>);
    }
});
