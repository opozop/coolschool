this.CoursesInsertController = RouteController.extend({
	template: "CoursesInsert",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("year_list"),
			Meteor.subscribe("service_list"),
			Meteor.subscribe("subject_list"),
			Meteor.subscribe("teacher_list"),
			Meteor.subscribe("courses_empty")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		return {
			params: this.params || {},
			year_list: Years.find({}, {transform:function(doc) {  return doc; },sort:["year"]}),
			service_list: Services.find({}, {sort:[["code","asc"]]}),
			subject_list: Subjects.find({}, {sort:[["code","asc"]]}),
			teacher_list: Teachers.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]}),
			courses_empty: Courses.findOne({_id:null}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});