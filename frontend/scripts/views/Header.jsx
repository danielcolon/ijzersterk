import React from 'react';
import {Link} from 'react-router';
import {Navbar, Nav, NavItem, CollapsibleNav} from 'react-bootstrap';
import {NavItemLink} from 'react-router-bootstrap';

export default React.createClass({
    render(){
        var rNav = (
            <Navbar brand='DSKV IJzersterk' inverse toggleNavKey={0}>
                <CollapsibleNav eventKey={0}> {/* This is the eventKey referenced */}
                    <Nav navbar>
                        <NavItemLink to="/" eventKey={1}>Home</NavItemLink>
                        <NavItemLink to="blogs" eventKey={2}>Blogs</NavItemLink>
                        <NavItemLink to="agenda" eventKey={3}>Agenda</NavItemLink>
                    </Nav>
                    <Nav navbar right>
                        <NavItemLink to="newmember" eventKey={1}>New member</NavItemLink>
                        <NavItemLink to="about" eventKey={2}>About</NavItemLink>
                        <NavItem eventKey={3}
                            href='http://wiki.ijzersterkdelft.nl/index.php/Hoofdpagina'>Wiki
                        </NavItem>
                    </Nav>
                </CollapsibleNav>
                <Link className="hidden-xs hidden-sm" to="home"><div className="logo"></div></Link>
            </Navbar>);
        return rNav;
    }
});
