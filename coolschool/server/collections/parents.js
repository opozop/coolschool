Parents.allow({
	insert: function (userId, doc) {
		return Parents.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Parents.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Parents.userCanRemove(userId, doc);
	}
});

Parents.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Parents.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Parents.before.remove(function(userId, doc) {
	
});

Parents.after.insert(function(userId, doc) {
	
});

Parents.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Parents.after.remove(function(userId, doc) {
	
});
