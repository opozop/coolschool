Years.allow({
	insert: function (userId, doc) {
		return Years.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Years.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Years.userCanRemove(userId, doc);
	}
});

Years.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Years.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Years.before.remove(function(userId, doc) {
	
});

Years.after.insert(function(userId, doc) {
	
});

Years.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Years.after.remove(function(userId, doc) {
	
});
