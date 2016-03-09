Meteor.publish("parent_list", function() {
	return Parents.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]});
});

Meteor.publish("parents_empty", function() {
	return Parents.find({_id:null}, {});
});

Meteor.publish("parent_details", function(parentId) {
	return Parents.find({_id:parentId}, {});
});

