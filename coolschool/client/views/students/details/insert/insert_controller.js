this.StudentsDetailsInsertController = RouteController.extend({
	template: "StudentsDetails",
	

	yieldTemplates: {
		'StudentsDetailsInsert': { to: 'StudentsDetailsSubcontent'}
		
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
			Meteor.subscribe("relatives_empty"),
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
			relatives_empty: Relatives.findOne({_id:null}, {}),
			student_details: Students.findOne({_id:this.params.studentId}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});