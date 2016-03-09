this.StudentsDetailsRelativesController = RouteController.extend({
	template: "StudentsDetails",
	

	yieldTemplates: {
		'StudentsDetailsRelatives': { to: 'StudentsDetailsSubcontent'}
		
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
			Meteor.subscribe("relatives", this.params.studentId),
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
			relatives: Relatives.find({studentId:this.params.studentId}, {}),
			student_details: Students.findOne({_id:this.params.studentId}, {}),
			parent_list: Parents.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});