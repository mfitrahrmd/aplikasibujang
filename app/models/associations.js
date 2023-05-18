const Event = require('./Event');
const EventPhotos = require('./EventPhotos');

Event.hasMany(EventPhotos, {
	foreignKey: 'eventId'
});

EventPhotos.belongsTo(Event);