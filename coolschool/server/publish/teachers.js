Meteor.publish("teacher_list", function() {
	return Teachers.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]});
});

Meteor.publish("teachers_empty", function() {
	return Teachers.find({_id:null}, {});
});

Meteor.publish("teacher_details", function(teacherId) {
	return Teachers.find({_id:teacherId}, {});
});

