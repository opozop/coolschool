Meteor.publish("year_list", function() {
	return Years.find({}, {transform:function(doc) {  return doc; },sort:["year"]});
});

Meteor.publish("years_empty", function() {
	return Years.find({_id:null}, {});
});

Meteor.publish("year_details", function(yearId) {
	return Years.find({_id:yearId}, {transform:function(doc) {  return doc; }});
});

