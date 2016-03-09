Meteor.publish("relatives", function(studentId) {
	return Relatives.publishJoinedCursors(Relatives.find({studentId:studentId}, {}));
});

Meteor.publish("relatives_empty", function() {
	return Relatives.publishJoinedCursors(Relatives.find({_id:null}, {}));
});

Meteor.publish("relative", function(realtiveId) {
	return Relatives.publishJoinedCursors(Relatives.find({_id:realtiveId}, {}));
});

