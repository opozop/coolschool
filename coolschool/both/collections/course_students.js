this.CourseStudents = new Mongo.Collection("course_students");

this.CourseStudents.userCanInsert = function(userId, doc) {
	return true;
}

this.CourseStudents.userCanUpdate = function(userId, doc) {
	return true;
}

this.CourseStudents.userCanRemove = function(userId, doc) {
	return true;
}
