this.Subjects = new Mongo.Collection("subjects");

this.Subjects.userCanInsert = function(userId, doc) {
	return true;
}

this.Subjects.userCanUpdate = function(userId, doc) {
	return true;
}

this.Subjects.userCanRemove = function(userId, doc) {
	return true;
}
