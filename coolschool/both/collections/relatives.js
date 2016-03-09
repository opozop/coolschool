this.Relatives = new Mongo.Collection("relatives");

this.Relatives.userCanInsert = function(userId, doc) {
	return true;
}

this.Relatives.userCanUpdate = function(userId, doc) {
	return true;
}

this.Relatives.userCanRemove = function(userId, doc) {
	return true;
}
