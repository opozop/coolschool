this.Years = new Mongo.Collection("years");

this.Years.userCanInsert = function(userId, doc) {
	return true;
}

this.Years.userCanUpdate = function(userId, doc) {
	return true;
}

this.Years.userCanRemove = function(userId, doc) {
	return true;
}
