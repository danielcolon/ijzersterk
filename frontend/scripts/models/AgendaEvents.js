var AgendaEvents = {
    events:[{
        type: 'training',
        startDate: '2015-10-09T14:00',
        endDate: '2015-10-09T15:00',
        title: 'VKR Training',
        description: 'Training en begeleiding in de VKR',
        attendees: [{
            name: 'Pouja',
        },{
            name: 'Daniel'
        }]
    },{
        type: 'training',
        startDate: '2015-10-02T14:00',
        endDate: '2015-10-02T20:00',
        title: 'VKR Training',
        description: 'Training en begeleiding in de VKR',
        attendees: [{
            name: 'Pouja',
        },{
            name: 'Daniel'
        },{
            name: 'Peter'
        },{
            name: 'Ruud'
        },{
            name: 'Maikel'
        }]
    },{
        type: 'social',
        startDate: '2015-10-20T10:00',
        endDate: '2015-10-20T24:00',
        title: 'Barbeque',
        description: 'Vlees, vuur, saus, bier. Wat wil je nog meer?',
        attendees: [{
            name: 'Pouja',
        },{
            name: 'Daniel'
        },{
            name: 'Peter'
        },{
            name: 'Ruud'
        },{
            name: 'Maikel'
        }]
    },{
        type: 'social',
        startDate: '2015-10-13T12:00',
        endDate: '2015-10-20T18:00',
        title: 'Intro week',
        description: 'Ontgroening van de nieuwe leden',
        attendees: [{
            name: 'Auke'
        }]
    },{
        type: 'training',
        startDate: '2015-10-09T14:00',
        endDate: '2015-10-09T15:00',
        title: 'Deadlift day',
        description: 'Deadlift, more deadlifts and then more deadlifts.',
        attendees: [{
            name: 'Pouja',
        },{
            name: 'Daniel'
        },{
            name:'Peter'
        }]
    }],
    types: [{
        type: 'training',
        style: 'important'
    },{
        type: 'social',
        style: 'warning'
    }],
    fetch(){
        return new Promise((resolve, reject)=> {
            resolve();
        });
    }
};
export default AgendaEvents;
