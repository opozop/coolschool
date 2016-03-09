Relatives.allow({
	insert: function (userId, doc) {
		return Relatives.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Relatives.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Relatives.userCanRemove(userId, doc);
	}
});

Relatives.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Relatives.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Relatives.before.remove(function(userId, doc) {
	
});

Relatives.after.insert(function(userId, doc) {
	
});

Relatives.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Relatives.after.remove(function(userId, doc) {
	
});
