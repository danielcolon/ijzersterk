import React from 'react';

export
default React.createClass({
    render() {
        return (<footer className="footer">
                    <div className="container">
                        <p className="pull-left">
                            <i className="fa fa-copyright"></i> 2015 - DSVK IJzersterk<br/>Eat well, train hard, sleep like a baby, make gainz like Arnold
                        </p>
                        <p className="pull-right non-mobile-float">
                            Find us on <a href="https://www.facebook.com/ijzersterkdelft"><i className="fa fa-facebook-official"></i></a><br/>
                            Contact us by <a href="mailto:dskv.ijzersterk@gmail.com"><i className="fa fa-envelope-o"></i></a><br/>
                            Web design by <a href="http://www.zokodesign.com"><img src="img/zoko_logo_wit.svg"/></a>
                        </p>
                    </div>
                </footer>);
    }
});
