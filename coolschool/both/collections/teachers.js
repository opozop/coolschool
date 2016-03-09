this.Teachers = new Mongo.Collection("teachers");

this.Teachers.userCanInsert = function(userId, doc) {
	return true;
}

this.Teachers.userCanUpdate = function(userId, doc) {
	return true;
}

this.Teachers.userCanRemove = function(userId, doc) {
	return true;
}
