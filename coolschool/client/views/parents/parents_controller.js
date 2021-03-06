this.ParentsController = RouteController.extend({
	template: "Parents",
	

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
			parent_list: Parents.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});