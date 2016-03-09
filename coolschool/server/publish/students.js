Meteor.publish("student_list", function() {
	return Students.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]});
});

Meteor.publish("students_empty", function() {
	return Students.find({_id:null}, {});
});

Meteor.publish("student_details", function(studentId) {
	return Students.find({_id:studentId}, {});
});

