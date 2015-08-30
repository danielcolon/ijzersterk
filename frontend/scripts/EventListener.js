import _ from 'lodash';

var listeners = {};
var EventListener = {
    flush(){
        listeners = {};
    },
    /**
     * Will call fn when 'name' event is emitted.
     * @param  {String}   name The name of the event to listen on.
     * @param  {Function} fn   The function to be invoked.
     */
    on(name, fn, comp) {
        if (!listeners.hasOwnProperty(name)) {
            listeners[name] = [];
        }
        listeners[name].push(fn);
    },
    /**
     * Emit the event
     * @param  {String}    name   The name of the event.
     * @param  {Array} values The values that should be sent with the emit.
     */
    emit(name, ...values) {
        if(listeners.hasOwnProperty(name)){
            listeners[name].forEach(function(fn){
                fn(...values);
            });
        }
    },
    /**
     * Partial call emit, this is usefull when you want to emit this when a dom event occurs.
     * For example: onClick(EventListener.partialEmit('click', 'some', 'values')).
     * @param  {String}    name   The name of the event.
     * @param  {Array} values     The values that should be sent with the emit.
     * @return {Function}         A partial function of EventListener.emit
     */
    partialEmit(name, ...values){
        return _.partial(EventListener.emit, name, ...values);
    }
};

export default EventListener;
