this.YearsEditController = RouteController.extend({
	template: "YearsEdit",
	

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
			Meteor.subscribe("year_details", this.params.yearId)
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
			year_details: Years.findOne({_id:this.params.yearId}, {transform:function(doc) {  return doc; }})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});