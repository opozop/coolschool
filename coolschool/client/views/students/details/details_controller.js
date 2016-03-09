this.StudentsDetailsController = RouteController.extend({
	template: "StudentsDetails",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.redirect('students.details.relatives', this.params || {}, { replaceState: true });
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("student_details", this.params.studentId),
			Meteor.subscribe("parent_list")
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
			student_details: Students.findOne({_id:this.params.studentId}, {}),
			parent_list: Parents.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});