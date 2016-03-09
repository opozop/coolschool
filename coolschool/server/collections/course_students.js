CourseStudents.allow({
	insert: function (userId, doc) {
		return CourseStudents.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return CourseStudents.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return CourseStudents.userCanRemove(userId, doc);
	}
});

CourseStudents.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

CourseStudents.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

CourseStudents.before.remove(function(userId, doc) {
	
});

CourseStudents.after.insert(function(userId, doc) {
	
});

CourseStudents.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

CourseStudents.after.remove(function(userId, doc) {
	
});
