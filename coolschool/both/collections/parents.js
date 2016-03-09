this.Parents = new Mongo.Collection("parents");

this.Parents.userCanInsert = function(userId, doc) {
	return true;
}

this.Parents.userCanUpdate = function(userId, doc) {
	return true;
}

this.Parents.userCanRemove = function(userId, doc) {
	return true;
}
