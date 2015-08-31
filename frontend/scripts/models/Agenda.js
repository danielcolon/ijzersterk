import _ from 'lodash';
import moment from 'moment';
import EL from '../EventListener.js';

//TODO This should be replaced by some service/model that fetches/represents the current logged in user
var user = {
    name: 'Pouja Nikray',
    id: 1,
    isAdmin: false
};

var Agenda = {
    events: [{
        id: 1,
        idEventType: 1,
        idOwner: 1,
        title: 'VKR Training',
        description: 'Weekelijkse training in de vkr',
        start: '2015-09-10T12:00:00',
        end: '2015-09-10T18:00:00',
        viewLevel: 1,
        editLevel: 2,
        subscribed: ['Pouja Nikray', 'Joey', 'Daniël Colon']
    }, {
        id: 2,
        idEventType: 1,
        idOwner: 1,
        title: 'VKR Training',
        description: 'Weekelijkse training in de vkr',
        start: '2015-09-17T12:00',
        end: '2015-09-17T18:00',
        viewLevel: 1,
        editLevel: 2,
        subscribed: ['Pouja Nikray', 'Joey', 'Daniël Colon']
    }, {
        id: 3,
        idEventType: 1,
        idOwner: 1,
        title: 'VKR Training',
        description: 'Weekelijkse training in de vkr',
        start: '2015-09-24T12:00',
        end: '2015-09-24T18:00',
        viewLevel: 1,
        editLevel: 2,
        subscribed: ['Pouja Nikray', 'Joey', 'Daniël Colon']
    }, {
        id: 4,
        idEventType: 1,
        idOwner: 1,
        title: 'VKR Training',
        description: 'Weekelijkse training in de vkr',
        start: '2015-10-01T12:00',
        end: '2015-10-01T18:00',
        viewLevel: 1,
        editLevel: 2,
        subscribed: ['Pouja Nikray', 'Joey', 'Daniël Colon']
    }],
    // Available types: important, warning, info, inverse, success, special
    types: [{
        id: 1,
        type: 'training',
        style: 'special'
    }],
    getEvent(id) {
        if (id === 'new' || id === null || id === undefined) {
            return {
                id: null,
                idEventType: 1,
                start: moment().format('YYYY-MM-DDTHH:mm:ss'),
                end: moment().add(3, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
                title: '',
                description: '',
                viewLevel:1,
                editLevel:1,
                subscribed: []
            }
        }
        return _.find(Agenda.events, {
            id: id
        });
    },
    createEvent(event) {
        event.id = _(Agenda.events)
            .pluck('id')
            .max()
            .value() + 1;
        Agenda.events.push(event);
        return event;
    },
    attend(event) {
        Agenda.getEvent(event.id).subscribed.push(user.name);
        EL.emit('event.changed', Agenda.getEvent(event.id));
    },
    leave(event) {
        _.remove(Agenda.getEvent(event.id).subscribed, function(name){
            return name === user.name;
        });
        EL.emit('event.changed', Agenda.getEvent(event.id));
    },
    canEdit(){
        return true
    },
    getEvents(date) {
        return Agenda.events.filter(function(event) {
            return date.isBetween(event.start, event.end, 'day') ||
                date.isSame(event.start, 'day') ||
                date.isSame(event.end, 'day');
        });
    },
    isAttending(event) {
        return event.subscribed.some(function(attendee) {
            return attendee === user.name;
        });
    }
};
export
default Agenda;
