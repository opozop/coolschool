Meteor.publish("service_list", function() {
	return Services.find({}, {sort:[["code","asc"]]});
});

Meteor.publish("services_empty", function() {
	return Services.find({_id:null}, {});
});

Meteor.publish("service_details", function(serviceId) {
	return Services.find({_id:serviceId}, {});
});

