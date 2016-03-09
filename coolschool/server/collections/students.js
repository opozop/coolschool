Students.allow({
	insert: function (userId, doc) {
		return Students.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Students.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Students.userCanRemove(userId, doc);
	}
});

Students.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Students.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Students.before.remove(function(userId, doc) {
	
});

Students.after.insert(function(userId, doc) {
	
});

Students.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Students.after.remove(function(userId, doc) {
	
});
