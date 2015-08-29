var Agenda = {
    events: [{
        id: 1,
        type: 'training',
        startDate: '2015-10-09T14:15',
        endDate: '2015-10-09T15:00',
        title: 'VKR Training',
        description: 'Training en begeleiding in de VKR',
        attendees: [{
            name: 'Pouja',
        }, {
            name: 'Daniel'
        }]
    }, {
        id: 2,
        type: 'training',
        startDate: '2015-10-02T14:00',
        endDate: '2015-10-02T20:00',
        title: 'VKR Training',
        description: 'Training en begeleiding in de VKR',
        attendees: [{
            name: 'Pouja',
        }, {
            name: 'Daniel'
        }, {
            name: 'Peter'
        }, {
            name: 'Ruud'
        }, {
            name: 'Maikel'
        }]
    }, {
        id: 3,
        type: 'social',
        startDate: '2015-10-20T03:00',
        endDate: '2015-10-20T23:59',
        title: 'Barbeque',
        description: 'Vlees, vuur, saus, bier. Wat wil je nog meer?',
        attendees: [{
            name: 'Pouja',
        }, {
            name: 'Daniel'
        }, {
            name: 'Peter'
        }, {
            name: 'Ruud'
        }, {
            name: 'Maikel'
        }]
    }, {
        id: 4,
        type: 'social',
        startDate: '2015-10-13T12:00',
        endDate: '2015-10-20T18:00',
        title: 'Intro week',
        description: 'Ontgroening van de nieuwe leden',
        attendees: [{
            name: 'Auke'
        }]
    }, {
        id: 5,
        type: 'training',
        startDate: '2015-10-09T14:00',
        endDate: '2015-10-09T15:00',
        title: 'Deadlift day',
        description: 'Deadlift, more deadlifts and then more deadlifts.',
        attendees: [{
            name: 'Pouja',
        }, {
            name: 'Daniel'
        }, {
            name: 'Peter'
        }]
    }, {
        id: 6,
        type: 'other',
        startDate: '2015-10-08T14:00',
        endDate: '2015-10-09T03:00',
        title: 'A special event!',
        description: '',
        attendees: []
    }],
    types: [{
        type: 'other',
        style: 'special'
    }, {
        type: 'training',
        style: 'important'
    }, {
        type: 'social',
        style: 'warning'
    }],
    getEvents(date) {
        return Agenda.events.filter(function(event) {
            return date.isBetween(event.startDate, event.endDate, 'day') ||
                date.isSame(event.startDate, 'day') ||
                date.isSame(event.endDate, 'day');
        });
    }
};
export
default Agenda;
