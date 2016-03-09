Teachers.allow({
	insert: function (userId, doc) {
		return Teachers.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Teachers.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Teachers.userCanRemove(userId, doc);
	}
});

Teachers.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Teachers.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Teachers.before.remove(function(userId, doc) {
	
});

Teachers.after.insert(function(userId, doc) {
	
});

Teachers.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Teachers.after.remove(function(userId, doc) {
	
});
