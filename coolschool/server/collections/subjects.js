Subjects.allow({
	insert: function (userId, doc) {
		return Subjects.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Subjects.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Subjects.userCanRemove(userId, doc);
	}
});

Subjects.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Subjects.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Subjects.before.remove(function(userId, doc) {
	
});

Subjects.after.insert(function(userId, doc) {
	
});

Subjects.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Subjects.after.remove(function(userId, doc) {
	
});
