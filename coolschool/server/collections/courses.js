Courses.allow({
	insert: function (userId, doc) {
		return Courses.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Courses.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Courses.userCanRemove(userId, doc);
	}
});

Courses.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Courses.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Courses.before.remove(function(userId, doc) {
	
});

Courses.after.insert(function(userId, doc) {
	
});

Courses.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Courses.after.remove(function(userId, doc) {
	
});
