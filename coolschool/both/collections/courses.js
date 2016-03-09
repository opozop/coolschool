this.Courses = new Mongo.Collection("courses");

this.Courses.userCanInsert = function(userId, doc) {
	return true;
}

this.Courses.userCanUpdate = function(userId, doc) {
	return true;
}

this.Courses.userCanRemove = function(userId, doc) {
	return true;
}
