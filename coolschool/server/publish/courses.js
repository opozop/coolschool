Meteor.publish("course_list", function() {
	return Courses.publishJoinedCursors(Courses.find({}, {sort:[["code","asc"]]}));
});

Meteor.publish("courses_empty", function() {
	return Courses.publishJoinedCursors(Courses.find({_id:null}, {}));
});

Meteor.publish("course_details", function(courseId) {
	return Courses.publishJoinedCursors(Courses.find({_id:courseId}, {}));
});

