Meteor.publish("subject_list", function() {
	return Subjects.find({}, {sort:[["code","asc"]]});
});

Meteor.publish("subjects_empty", function() {
	return Subjects.find({_id:null}, {});
});

Meteor.publish("subject_details", function(subjectId) {
	return Subjects.find({_id:subjectId}, {});
});

