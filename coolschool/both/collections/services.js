this.Services = new Mongo.Collection("services");

this.Services.userCanInsert = function(userId, doc) {
	return true;
}

this.Services.userCanUpdate = function(userId, doc) {
	return true;
}

this.Services.userCanRemove = function(userId, doc) {
	return true;
}
