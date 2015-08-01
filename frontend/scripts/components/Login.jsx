import React from 'react';
import $ from 'jquery';

export
default React.createClass({
    handleSubmit(event) {
        event.preventDefault();
        var credentials = {
            username: React.findDOMNode(this.refs.username),
            password: React.findDOMNode(this.refs.password)
        };
        $.ajax({
            type: 'PUT',
            url: 'http://api.ijzersterkdelft.nl/user/login',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(credentials),
            beforeSend: function(xhr) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
        });
    },
    render() {
        return (
            <form name="form" role="form" className="col-md-4 col-md-offset-4" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <input ref="username" required placeholder="username" name="username" className="form-control"/>
                </div>
                <div className="form-group">
                    <input ref="password" required placeholder="password" name="password" className="form-control" type="password"/>
                </div>
                <div>
                    <button className="btn btn-primary pull-right" type="submit">Login</button>
                </div>
            </form>
        );
    }
});
