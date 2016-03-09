Meteor.publish("year_events", function(yearId) {
	return Events.find({yearId:yearId}, {});
});

Meteor.publish("year_event_empty", function() {
	return Events.find({_id:null}, {});
});

Meteor.publish("year_event", function(eventId) {
	return Events.find({_id:eventId}, {});
});

