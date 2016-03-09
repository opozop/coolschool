this.StudentsDetailsEditController = RouteController.extend({
	template: "StudentsDetails",
	

	yieldTemplates: {
		'StudentsDetailsEdit': { to: 'StudentsDetailsSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("StudentsDetails"); this.render("loading", { to: "StudentsDetailsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("parent_list"),
			Meteor.subscribe("relative", this.params.realtiveId),
			Meteor.subscribe("student_details", this.params.studentId)
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
			parent_list: Parents.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]}),
			relative: Relatives.findOne({_id:this.params.realtiveId}, {}),
			student_details: Students.findOne({_id:this.params.studentId}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});