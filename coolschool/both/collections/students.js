this.Students = new Mongo.Collection("students");

this.Students.userCanInsert = function(userId, doc) {
	return true;
}

this.Students.userCanUpdate = function(userId, doc) {
	return true;
}

this.Students.userCanRemove = function(userId, doc) {
	return true;
}
