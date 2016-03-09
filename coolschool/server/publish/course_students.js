Meteor.publish("course_students", function(courseId) {
	return CourseStudents.publishJoinedCursors(CourseStudents.find({courseId:courseId}, {}));
});

Meteor.publish("course_students_empty", function() {
	return CourseStudents.publishJoinedCursors(CourseStudents.find({_id:null}, {}));
});

Meteor.publish("course_student", function(course_studentId) {
	return CourseStudents.publishJoinedCursors(CourseStudents.find({_id:course_studentId}, {}));
});

