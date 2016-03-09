this.DashboardController = RouteController.extend({
	template: "Dashboard",
	

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
			Meteor.subscribe("student_list"),
			Meteor.subscribe("course_list"),
			Meteor.subscribe("year_list"),
			Meteor.subscribe("service_list"),
			Meteor.subscribe("subject_list")
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
			student_list: Students.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]}),
			course_list: Courses.find({}, {sort:[["code","asc"]]}),
			year_list: Years.find({}, {transform:function(doc) {  return doc; },sort:["year"]}),
			service_list: Services.find({}, {sort:[["code","asc"]]}),
			subject_list: Subjects.find({}, {sort:[["code","asc"]]})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});