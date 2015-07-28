import React from 'react';
import Todo from './todo.jsx';

export
default React.createClass({
    getInitialState() {
        return {
            todos: ['yo', 'lo']
        };
    },
    render() {
        let children = this.state.todos.map((todo, index) => <Todo value={todo} key={index}/>);
        return <ul>{children}</ul>;
    }
});
