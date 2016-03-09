this.TeachersController = RouteController.extend({
	template: "Teachers",
	

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
			Meteor.subscribe("teacher_list")
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
			teacher_list: Teachers.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});